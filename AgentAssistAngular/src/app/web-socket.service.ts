import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';
import { ADUtility } from './utilities';
import { SocketConnection } from './socket-connection';

@Injectable()
export class WebSocketService {
  socketEventsSub: any;
  socket: SocketConnection;
  constructor(public adUtility: ADUtility) {
    console.log('inside WebSocketService constructor');
  }

  sendMessage(data) {
    this.emit('agent_message', data);
  }

  sendControlMessage(data) {
    this.emit('control_message', data);
  }

  closeConversation(data) {
    const msg = {
      "id": data._id,
      "orgId": data.orgId
    };
    console.log('conversation_closed', data);
    this.emit('conversation_closed', data);
  }

  sendWebRTCData(data) {
    this.emit('event', data);
  }

  requestPort(data) {
    this.emit('request_port', data);
  }

  init() {
    this.socket = new SocketConnection(this.adUtility);
    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("Connected");
    });

    this.socket.on("connect_error", (err) => {
      console.error("Error while connecting", err);
    });

    this.socket.on("open_conversations", (data) => {
      console.log("open_conversations::", data);
      // this.store.publish('open_conversations', data)
      // if (data && data.length) {
      //   this.store.publish('conversation.update_conv_count', {count : data.length})
      // } else {
      //   this.store.publish('conversation.update_conv_count', {count : 0})
      // }
    });

    this.socket.on("active_conversations", (data) => {
      console.log("active_conversations::", data);
    });

    this.socket.on("user_message", (data) => {
      console.log("user message::", data);
      //this.store.publish('user_message', data);
    });

    this.socket.on("agent_message", (data) => {
      console.log("agent_message::", data);
      //this.store.publish('agent_message', data);
    });

    this.socket.on('new_conversation', (data) => {
      console.log("new_conversation:", data);
      //this.store.publish('conversation.newConversation', data);
    })

    this.socket.on('update_conversation', (data) => {
      console.log("update_conversation:", data);
      //this.store.publish('conversation.conversationUpdated', data);
    })

    this.socket.on('agentassist_response', (data) => {
      console.log("agentassist_response:", data);
      //this.store.publish('conversation.agentassist_response', data);
    })

    this.socket.on('conversation_closed', (data) => {
      console.log("conversation_closed:", data);
      //this.store.publish('conversation.conversationClosed', data);
    })

    // /
    this.socket.on('delete_conversation', (data) => {
      console.log("delete_conversation:", data);
      //this.store.publish('conversation.deleteConversation', data);
    })

    this.socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        console.log("io server disconnect. Socket will reconnect:");
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });

    // on web socket token expiry, call refresh token method
    this.socket.on('error', (reason) => {
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

    this.socket.on("agent_force_logout", (data) => {});

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
