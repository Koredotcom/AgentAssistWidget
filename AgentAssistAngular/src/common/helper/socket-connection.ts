import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { ADUtility } from './utilities';

@Injectable()
export class SocketConnection extends Socket {

    constructor(public adUtility : ADUtility) {
      super(adUtility.getSocketConfig());
    }
}
