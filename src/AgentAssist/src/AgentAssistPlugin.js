import React from 'react';

import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import axios from 'axios';


import CustomTaskListContainer from './components/CustomTask/CustomTask';
import reducers, { namespace } from './states';
//import CustomCRM from './components/CustomCRM';


const PLUGIN_NAME = 'AgentAssistPlugin';

export default class AgentAssistPlugin extends FlexPlugin {
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

  async init(flex, manager){
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
    flex.Actions.addListener('afterAcceptTask', async (payload) => {
      console.log("beforeSelectTask ===> ", payload);

      if (
        payload.task &&
        payload.task.attributes
      ) {

        let { agentassistURL, token, smartassistURL, botId, isCall} = funcResponse.data;
        let conversationid;
        debugger
        if(payload.task.channelType === "voice"){
          isCall = true;
          conversationid = payload?.task?.attributes["caller"];
          conversationid = conversationid.replace("+", "%2B");
        }else{
          isCall = false;
          conversationid = payload.task.attributes.conversationSid;
          const manager = Twilio.Flex.Manager.getInstance();
          console.log(flex.ChatEventEmitter);
        }
      // conversationid = "14152367315";
      console.log("---------------->",conversationid, "isCall----->", isCall);
      let iframeURL = `${agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${token}&botid=${botId}&agentassisturl=${smartassistURL}&conversationid=${conversationid}&source=smartassist&isCall=${isCall}`;
      console.log("Iframe URL ====>  ", iframeURL);

      manager.store.dispatch({type:"IFRAME_URL", iframeUrl:`${iframeURL}`})

      }
      // no account number found
      else {
        console.log("Error in Payload")
      }
      
    });
    flex.Actions.addListener('afterCompleteTask', (payload) => {
      console.log("completing the task", payload);
      manager.store.dispatch({type:"IFRAME_URL", iframeUrl:`about:blank`})
    });

   
    const body = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      identity: "number"
    };

    // getting generated token from twilio function
    // serverlessURL = "https://8fb6-115-114-88-222.ngrok.io/sendMessage"
    var funcResponse = await axios.post(serverlessURL, body);

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
