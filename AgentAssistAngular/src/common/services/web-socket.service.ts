import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';
import { ADUtility } from '../helper/utilities';
import { SocketConnection } from '../helper/socket-connection';
import { EVENTS } from '../helper/events';

@Injectable()
export class WebSocketService {
  socketEventsSub: any;
  socket: SocketConnection;
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

    this.socket.on(EVENTS.connect, () => {
      console.log("Connected");
    });

    this.socket.on(EVENTS.connect_error, (err) => {
      console.error("Error while connecting", err);
    });

    this.socket.on(EVENTS.agent_menu_response, (err) => {
      console.error("Error while connecting", err);
    });

    this.socket.on(EVENTS.user_message, (data) => {
      console.log("user message::", data);
      //this.store.publish('user_message', data);
    });

    this.socket.on(EVENTS.agent_message, (data) => {
      console.log("agent_message::", data);
      //this.store.publish('agent_message', data);
    });

    this.socket.on(EVENTS.agent_assist_request, (data) => {
      console.log("agentassist_response:", data);
      //this.store.publish('conversation.agentassist_response', data);
    })

    this.socket.on(EVENTS.disconnect, (reason) => {
      if (reason === "io server disconnect") {
        console.log("io server disconnect. Socket will reconnect:");
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });

    // on web socket token expiry, call refresh token method
    this.socket.on(EVENTS.error, (reason) => {
      if (reason === 'ERR_TOKEN_EXPIRED') {
        // Disconnect Web Socket to prevent auto reconnect
        this.socket.disconnect();

        /* this.authService.isRefreshingToken = true;
        this.authService.tokenSubject.next(null);

        // refreshToken method take cares of redirecting to login page, in case of invalid token
        this.authService.refreshToken()
          .pipe(finalize(() => this.authService.isRefreshingToken = false))
          .subscribe((tokenRes) => {
            if (tokenRes) {
              this.authService.updateAuthInfoWithRefreshTokenResponse(tokenRes);
              this.authService.tokenSubject.next(tokenRes);
              this.socket.connect();
            }
          }) */
      }
    })

  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data) {
    this.socket.emit(eventName, data)
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.socket.connect();
  }


}
