import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ServiceInvokerService } from '../services/service-invoker.service';
import { RootService } from '../services/root.service';

const CHUNK_SIZE = 1024 * 2024 * 5;
@Injectable({
  providedIn: 'root'
})
export class ChunkFileUploadService {
  blobs: any = [];
  totalChunks: any;
  currChunk: any;

  constructor(private service: ServiceInvokerService, private rootService: RootService) { }

  getFileToken(): Observable<any> {
    return this.service.invoke('post.file.token', {}, {}, {}, this.rootService.connectionDetails.agentassisturl).pipe(map(res => {
      return res.fileToken;
    }));
  }

  uploadChunkFile(token, file): Observable<any> {
    this.blobs = [];
    return new Observable((observe)=>{
      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const blob = file.slice(start, start + CHUNK_SIZE + 1);
        this.blobs.push(blob);
      }
  
      const params = {
        fileToken: token
      };
      let splitName = file.name.split('.');
      let ext = splitName[splitName.length - 1];
  
      this.totalChunks = Math.floor(file.size / CHUNK_SIZE) + 1;
      this.currChunk = 0;
      (async () => {
        await this.startChunkUpload(token, file, function(value){
          observe.next(value);
          observe.complete();
        });
      })()
    });

    
   
  }

  async startChunkUpload(token, file, callback) {
    const params = {
      fileToken: token
    };

    const blob = this.blobs[this.currChunk];

    const _mdat = new MultipartData();
    let _self = this;
    var reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) { // DONE == 2
        var dataObj: any = evt.target.result;
        dataObj = dataObj.replace(/^.*;base64,/, "");
        dataObj = dataObj.replace('data:application/octet-stream;base64,', '');
        let chunk = dataObj;

        if (_self.currChunk < _self.totalChunks) {
          _mdat.append('chunkNo', _self.currChunk);
          _mdat.append('messageToken', token);
          _mdat.append('chunk', {
            data: chunk,
            fileName: file.name
          });
          let data = _mdat;
          console.log("chunk >>>>>>>>>", data);
          _self.service.invoke('post.uploadfaqfile.chunk', params, data, {}, _self.rootService.connectionDetails.agentassisturl).subscribe(
            res => {
              console.log(res, "??????????????");
              if (_self.currChunk + 1 == _self.totalChunks) {
                const _mdatFinal = new FormData();
                _mdatFinal.append('totalChunks', _self.totalChunks);
                _mdatFinal.append('messageToken', token);
                _mdatFinal.append('fileExtension', file.name.substring(file.name.lastIndexOf('.') + 1));
                _mdatFinal.append('fileContext', "bulkImport");
                _mdatFinal.append('Content-Type', file.type);
                _mdatFinal.append('filename', file.name);
                console.log("_mdatFinal >>>>>>>", _mdatFinal);

                _self.service.invoke('post.uploadfaqfile.fileId', params, _mdatFinal, { 'X-HTTP-Method-Override': 'put' }, _self.rootService.connectionDetails.agentassisturl).subscribe(
                  res => {
                    console.log(res);
                    callback(res.fileId);
                  }, err => {
                  }
                )
              } else {
                _self.currChunk++;
                _self.startChunkUpload(token, file, callback);
              }
            }, err => {
            }
          )

        }
      } else {
        // errorListener(_scope, evt);
      }
    };
    reader.readAsDataURL(blob);
  }

}

function MultipartData() {
  this.boundary = "--------MultipartData" + Math.random();
  this._fields = [];
}
MultipartData.prototype.append = function (key, value) {
  this._fields.push([key, value]);
};

MultipartData.prototype.toString = function () {
  var boundary = this.boundary;
  var body = "";
  this._fields.forEach(function (field) {
    body += "--" + boundary + "\r\n";
    // file upload
    if (field[1].data) {
      var file = field[1];
      if (file.fileName) {
        body += "Content-Disposition: form-data; name=\"" + field[0] + "\"; filename=\"" + file.fileName + "\"";
      } else {
        body += "Content-Disposition: form-data; name=\"" + field[0] + "\"";
      }
      body += "\r\n";
      if (file.type) {
        body += "Content-Type: UTF-8; charset=ISO-8859-1\r\n";
      }
      body += "Content-Transfer-Encoding: base64\r\n";
      body += "\r\n" + file.data + "\r\n"; //base64 data
    } else {
      body += "Content-Disposition: form-data; name=\"" + field[0] + "\";\r\n\r\n";
      body += field[1] + "\r\n";
    }
  });
  body += "--" + boundary + "--";
  return body;
};
