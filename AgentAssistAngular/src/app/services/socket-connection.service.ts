import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketConnection {
  ioSocket = null;

  constructor(private rootService: RootService) {
    //super(adUtility.getSocketConfig());
    let finalUrl = this.rootService.getConnectionDetails().agentassisturl + '/koreagentassist';
    const config = {
      url: finalUrl,
      forceNew: true, 
      options: {
        path: '/agentassist/api/v1/chat',
        autoConnect: false,
        transports: ['websocket', 'polling', 'flashsocket'],
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 13,
        query: {'jToken': this.rootService.getConnectionDetails().token }
      }
    };
    this.ioSocket =  io(config.url, config.options)
  }

connect() {
  // change isLogin query params on ws reconnection
  const ioSocketQuery = {
    ...this.ioSocket.io.opts.query,
  };

  this.ioSocket.io.opts.query = ioSocketQuery;
  this.ioSocket.connect();
}

  on(event, cb) {  
    this.ioSocket.io.opts.query.isLogin = false;
    this.ioSocket.on(event, cb);
  }

  emit(event, data) {
    this.ioSocket.emit(event, data)
  }

  disconnect(flag = false) {
    this.ioSocket.disconnect(flag);
  }
}
