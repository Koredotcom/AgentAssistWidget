import React from 'react';

import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import axios from 'axios';


import CustomTaskListContainer from './components/CustomTask/CustomTask';
import reducers, { namespace } from './states';
//import CustomCRM from './components/CustomCRM';


const PLUGIN_NAME = 'AgentAssistPlugin';

export default class AgentAssistPlugin extends FlexPlugin {
  eventListenerAdded = false;
  _handleMessageAddedListener = null;
  isCallConversation = false;
  activeConversationId = '';
  _conversations = {};
  constructor() {
    super(PLUGIN_NAME);

  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */

  async init(flex, manager) {

    this.createWindowListener();
    this.registerReducers(manager);

    // flex.AgentDesktopView.Panel2.Content.remove('container');
    // // flex.AgentDesktopView.defaultProps.showPanel2=false;
    // flex.AgentDesktopView.Panel2.Content.replace(

    // )
    // flex.AgentDesktopView.Panel1.Content.add(<CustomTaskListContainer key="AgentAssistPlugin-component" />, options);
    // flex.AgentDesktopView.Panel2.Content.remove('container');
    flex.AgentDesktopView.Panel2.Content.replace(<CustomTaskListContainer key="AgentAssistPlugin-component" />)

    manager.strings.NoTasks = "Welcome to Twilio flex, This page is for Kore.AI";
    const currentFlexConfig = Twilio.Flex.Manager.getInstance().serviceConfiguration.attributes;
    console.log(currentFlexConfig);
    console.log(Twilio.Flex.Manager.events);
    let serverlessURL = currentFlexConfig?.kore_agent_assist?.runtime_service;
    console.log("********* serverless URL *********");
    console.log(serverlessURL);
    console.log("**********************************");
    const body = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      identity: "number"
    };

    // getting generated token from twilio function
    // serverlessURL = "https://8fb6-115-114-88-222.ngrok.io/sendMessage"
    var funcResponse = await axios.post(serverlessURL, body);
    let { agentassistURL, token, smartassistURL, botId, isCall } = funcResponse.data;
    let conversationid;
    console.log("11111111111111111111 state", manager.store.getState())

    manager.store.subscribe(() => {
      let flex = manager.store.getState().flex;
      this.activeConversationId = flex?.chat?.messageList?.activeConversation;
      let convObj = flex?.chat?.conversations[this.activeConversationId];
      console.log("11111111111111 this.activeConversationId", this.activeConversationId, convObj);
      if (this.atleastOneKeyExist(convObj)) {
        console.log("11111111111 conversation exist")
        //manager.store.dispatch({type:"IFRAME_URL", iframeUrl:`about:blank`});
        this.isCallConversation = false;
        if (!this._conversations[this.activeConversationId]) {
          this._conversations[this.activeConversationId] = {};
          this._conversations[this.activeConversationId].iframeLoaded = false;
        }
        console.log("11111111 this._conversations[this.activeConversationId]", this._conversations[this.activeConversationId])
        if (!this._conversations[this.activeConversationId].iframeLoaded) {
          let iframeURL = `${agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${token}&botid=${botId}&agentassisturl=${smartassistURL}&conversationid=${this.activeConversationId}&source=salesforce&isCall=false`;
          console.log("Iframe URL ====>  ", iframeURL);
          this.setIframeLoadedForAllConversations(false);
          this._conversations[this.activeConversationId].iframeLoaded = true;
          manager.store.dispatch({ type: "IFRAME_URL", iframeUrl: `${iframeURL}` });
          setTimeout(() => {
            let _self = this;
            let iframe = document.getElementById('agentassist-iframe');
            if (iframe.attachEvent) {
              iframe.attachEvent("onload", function () {
                //alert("Local iframe is now loaded.(IE)");
                _self.sendUnreadMessages(convOb, agentassistURLj);
              });
            } else {
              iframe.onload = function () {
                //alert("Local iframe is now loaded.(non-IE)");
                _self.sendUnreadMessages(convObj, agentassistURL);
              };
            }
          }, 1000);
        }
        this.sendUnreadMessages(convObj, agentassistURL);


      } else {
        this.isCallConversation = true;
      }

    });

    flex.Actions.addListener('afterAcceptTask', async (payload) => {
      console.log("beforeSelectTask ===> ", payload);

      if (
        payload.task &&
        payload.task.attributes
      ) {

        if (payload.task.channelType === "voice") {
          this.isCallConversation = true;
          isCall = true;
          conversationid = payload?.task?.attributes["caller"];
          conversationid = conversationid.replace("+", "%2B");
        } else {
          this.isCallConversation = false;
          isCall = false;
          conversationid = payload.task.attributes.conversationSid;
          //this.handleConversation(conversationid);
        }
        // conversationid = "14152367315";
      }
      // no account number found
      else {
        console.log("Error in Payload")
      }

    });
    flex.Actions.addListener('afterCompleteTask', (payload) => {
      console.log("completing the task", payload);
      manager.store.dispatch({ type: "IFRAME_URL", iframeUrl: `about:blank` })
    });




    console.log("----------------func----------------------------");
    console.log(funcResponse.data);
    console.log("----------------change----------------------------");
    // flex.AgentDesktopView.defaultProps.showPanel2  = false;
    // https://dev-agentassist.kore.ai/koreagentassist-sdk/UI/agentassist-iframe.html

    // When new task is accepted
    // changeURL(iframeURL);




    const options = { sortOrder: -1 };

    // let iframeURL = "https://www.bing.com/";
    // let count = 0;
    // setInterval(() => {
    //   manager.store.dispatch({type:"IFRAME_URL", iframeUrl:`https://www.bing.com/search?q=${++count}`})
    // }, 5000);

  }
  createWindowListener() {
    console.log("111111111111111 registering window listener for agentassist")
    window.addEventListener("message", (event) => {
      console.log("11111111111 inside window eventlistener", this.activeConversationId, event.data);
      var recordId = this.activeConversationId;
      if (event.data.name === "agentAssist.SendMessage" && event.data.conversationId == this.activeConversationId) {
        //console.log(event.data.payload);
        var msg = '';
        try {
          msg = JSON.parse(decodeURI(event.data.payload)).message[0].cInfo.body;
        } catch (e) {
          msg = decodeURI(encodeURI(event.data.payload));
        }
        console.log("1111111111111111 sending message", msg);
        /* var conversationKit = cmp.find("conversationKit");
         //console.log("RecordId", recordId);
         conversationKit.sendMessage({
             recordId: recordId,
             message: {
                 text:msg
             }
         })
       .then(function(result){
             if (result) {
                     console.log("Successfully sent message");
                 } else {
                     console.log("Failed to send message");
                 }
       });*/
      } else if (event.data.name === "agentAssist.CopyMessage" && event.data.conversationId == this.activeConversationId) {
        var msg = decodeURI(encodeURI(event.data.payload));
        console.log("1111111111111111 copying message", msg);
        /*  var conversationKit = cmp.find("conversationKit");
         conversationKit.setAgentInput({
             recordId: recordId,
             message: {
                 text:msg
             }
         })
       .then(function(result){
             if (result) {
                     console.log("Successfully sent message");
                 } else {
                     console.log("Failed to send message");
                 }
       });*/
      }
    }, false);
  }
  sendUnreadMessages(convObj, agentassistURL) {
    // check if there are any unreadmessages, if yes send the messages
    if (convObj && convObj.unreadMessages && convObj.unreadMessages.length > 0) {
      let unreadMessages = convObj.unreadMessages;
      for (let i = 0; i < unreadMessages.length; i++) {
        let source = unreadMessages[i]?.source;
        let state = source?.state;
        if (state && state.participantSid && state?.type === 'text') {
          let sid = state['sid'];
          if (!this._conversations[sid]) {
            let unreadMessage = state.body;
            console.log("111111111111111111 unreadMessage", unreadMessage)
            this._conversations[sid] = {};
            this._conversations[sid]['message'] = unreadMessage;
            this.sendMessageToAgentAssist(this.activeConversationId, unreadMessage, agentassistURL);


          }

        }
      }
    }
  }
  sendMessageToAgentAssist(conversationId, message, agentAssistURL) {
    let iframe = document.getElementById('agentassist-iframe');
    if (!iframe) {
      return;
    }
    console.log("111111111 iframe", iframe);
    var recordId = conversationId;
    var content = message;
    console.log("New Message recordId:" + recordId + " content:" + content);
    var message = {};
    message['author'] = {};
    message['author'].Id = '';
    message['author'].type = 'USER';
    message['conversationid'] = recordId;
    message['name'] = 'agentAssist.CustomerMessage';
    message['value'] = content;
    var vfWindow = iframe.contentWindow;
    if (vfWindow) {
      vfWindow.postMessage(message, agentAssistURL);//window.location.protocol+'//'+window.location.host);
    }
  }
  setIframeLoadedForAllConversations(flag) {
    for (let key in this._conversations) {
      this._conversations[key].iframeLoaded = false;
    }
  }
  atleastOneKeyExist(obj) {
    var count = 0;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        ++count;
      }
    }
    return count;
  }
  handleConversation(conversationid) {
    const manager = Twilio.Flex.Manager.getInstance();
    let convObj = manager.store.getState().flex.chat.conversations[conversationid];

    manager.store.subscribe(() => {
      console.log("1111111111111111111 convObj", manager.store.getState());
      if (convObj && convObj.unreadMessages && convObj.unreadMessages.length > 0) {
        let unreadMessages = convObj.unreadMessages;
        for (let i = 0; i < unreadMessages.length; i++) {
          let source = unreadMessages[i]?.source;
          let state = source?.state;
          if (state && state.participantSid && state?.type === 'text') {
            let sid = state['sid'];
            if (!this._conversations[sid]) {
              let unreadMessage = state.body;
              console.log("111111111111111111 unreadMessage", unreadMessage)
              this._conversations[sid] = {};
              this._conversations[sid]['message'] = unreadMessage;
            }

          }
        }
      }
      console.log("---------------->", conversationid, "isCall----->", isCall);
      let iframeURL = `${agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${token}&botid=${botId}&agentassisturl=${smartassistURL}&conversationid=${conversationid}&source=salesforce&isCall=${isCall}`;
      console.log("Iframe URL ====>  ", iframeURL);
      manager.store.dispatch({ type: "IFRAME_URL", iframeUrl: `${iframeURL}` })

    })

  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
