import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ServiceInvokerService } from '../services/service-invoker.service';
import { RootService } from '../services/root.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
   // Set your upload URL here

  constructor(private http: HttpClient, private serviceInvoker: ServiceInvokerService, private rootService: RootService) {}

  getFileToken(): Observable<any> {
    return this.serviceInvoker.invoke('post.file.token', {}, {}, {}, this.rootService.connectionDetails.agentassisturl).pipe(map(res => {
      return res.fileToken;
    }));
  }

  uploadChunk(token, file, chunk, chunkNumber: number, totalChunks: number): Observable<any> {
    console.log("🚀 ~ FileUploadService ~ uploadChunk ~ file:", file)
    const params = {
      fileToken: token
    };
    // const self = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const formData: any = new FormData();
    formData.append('chunk', chunk);
    formData.append('fileContext', 'agentdesktop');
    formData.append('fileExtension', file?.name.substring(file?.name.lastIndexOf('.') + 1));
    formData.append('Content-Type', file?.type);
    formData.append('chunkNo', chunkNumber.toString());
    formData.append('messageToken', token);
    formData.append('totalChunks', totalChunks.toString());
    formData.append('filename', file?.name);

    let headers = new HttpHeaders({
    //   'Content-Range': `bytes ${start}-${end - 1}/${file?.size}`,
    'enctype': 'multipart/form-data'
    });
    if(chunkNumber === totalChunks) {
      this.serviceInvoker.invoke('post.uploadfaqfile.chunk', params, formData, headers, this.rootService.connectionDetails.agentassisturl).subscribe(res => {
        let headers1 = new HttpHeaders({
          //   'Content-Range': `bytes ${start}-${end - 1}/${file?.size}`,
          'enctype': 'multipart/form-data',
          'X-HTTP-Method-Override': 'put'
          });
        console.log("🚀 ~ FileUploadService ~ this.serviceInvoker.invoke ~ headers:", headers)
        this.serviceInvoker.invoke('post.uploadfaqfile.fileId', params, formData, headers1, this.rootService.connectionDetails.agentassisturl).subscribe(fileIdRes => {
          if(fileIdRes?.hash !== '') {
            return fileIdRes;
          }
        });
      });
    } else {
      return this.serviceInvoker.invoke('post.uploadfaqfile.chunk', params, formData, headers, this.rootService.connectionDetails.agentassisturl)
    }
    ;
  }
}
