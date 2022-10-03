import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from 'rxjs/operators';
import { ADUtility } from '../helper/utilities';
import { SocketConnection } from '../helper/socket-connection';
import { EVENTS } from '../helper/events';

@Injectable()
export class WebSocketService {
  socketEventsSub: any;
  socket: SocketConnection;
  agentAssistResponse$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  notifications$: Observable<any[]> = this.agentAssistResponse$.asObservable();
  constructor(public adUtility: ADUtility) {
    console.log('inside WebSocketService constructor');
  }

  sendMessage(data) {
    this.emit(EVENTS.agent_message, data);
  }

  sendControlMessage(data) {
    this.emit(EVENTS.control_message, data);
  }

  closeConversation(data) {
    const msg = {
      "id": data._id,
      "orgId": data.orgId
    };
    console.log(EVENTS.conversation_closed, data);
    this.emit(EVENTS.conversation_closed, data);
  }

  sendWebRTCData(data) {
    this.emit(EVENTS.event, data);
  }

  requestPort(data) {
    this.emit(EVENTS.request_port, data);
  }

  init() {
    this.socket = new SocketConnection(this.adUtility);
    this.socket.connect();
  }

  registerEvents() {
    this.listen(EVENTS.connect).subscribe((res: any) => {
      console.log("Connected");
      this.agentAssistResponse$.next(res);
  });
    this.listen(EVENTS.agent_assist_response).subscribe((res: any) => {
        console.log("--------------responseeeeeeeeeeeeeeeeeeeeeeee", res)
        this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.connect_error).subscribe((err: any) => {
      console.error("Error while connecting", err);
     // this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.agent_menu_response).subscribe((res: any) => {
      console.error("menu response", res);
     // this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.user_message).subscribe((res: any) => {
      console.error("user_message", res);
     // this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.agent_message).subscribe((res: any) => {
      console.error("agent_message", res);
     // this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.agent_assist_request).subscribe((res: any) => {
      console.error("agent_assist_request", res);
     // this.agentAssistResponse$.next(res);
    });
    this.listen(EVENTS.disconnect).subscribe((res: any) => {
      if (res === "io server disconnect") {
        console.log("io server disconnect. Socket will reconnect:");
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
    });
    // on web socket token expiry, call refresh token method
    this.listen(EVENTS.error).subscribe((res: any) => {
      if (res === 'ERR_TOKEN_EXPIRED') {
        // Disconnect Web Socket to prevent auto reconnect
        this.socket.disconnect();
      }
    });
  }

  listen(eventName: string) {
    console.log("came to listen")
    return new Observable(subscriber => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data) {
    this.socket.emit(eventName, data);
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.socket.connect();
  }


}
