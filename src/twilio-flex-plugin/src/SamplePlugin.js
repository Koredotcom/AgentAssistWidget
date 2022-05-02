import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';
//import * as AgentAssist from './utils/AgentAssist';

const PLUGIN_NAME = 'SamplePlugin';
var agentId = '';
export default class SamplePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }
  async sanitize(str) {
    str = str.replaceAll("\+", "__");
    return str;
  }
  
  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);
    console.log("1111111111111111111 manager", manager.user.identity);
    agentId = manager.user.identity;
    new AgentAssist('agentassist-maincontainer', 'dummy-conv', agentId, 'st-8b3ca668-244a-5f38-aff9-768ebc1f10bb');

    const options = { sortOrder: -1 };
    flex.AgentDesktopView.Panel2.Content.replace(<CustomTaskListContainer key="agent-assist" />, {sortOrder: -1});
    //flex.AgentDesktopView.Panel1.Content.add(<CustomTaskListContainer key="SamplePlugin-component" />, options);
    /*flex.CRMContainer.defaultProps.uriCallback = (task) => {
      if (task) {
        console.log("11111111111111111111", task.attributes)
      }
      return task 
        ? `https://bing.com/?q=${task.attributes.name}`
        : 'https://bing.com';
    }*/
    flex.Actions.replaceAction("AcceptTask", (payload, original) => {
      console.log("11111111111111111111 AcceptTask", payload);
      let _convId = '';
      if (payload.task.attributes["channelType"] === 'sms') {
        //_convId = payload.task.attributes["name"];
        return;
      }
      _convId = payload.task.attributes["caller"];
      
      
      return new Promise((resolve, reject) => {
          var a1 = new AgentAssist('agentassist-maincontainer', _convId, agentId, 'st-8b3ca668-244a-5f38-aff9-768ebc1f10bb');
          resolve();
      }).then(() => original(payload));
    });

    flex.Actions.replaceAction("CompleteTask", (payload, original) => {
      console.log("11111111111111111111 CompleteTask", payload);
      //flex.AgentDesktopView.Panel2.Content.remove("agent-assist");
      var agentAssistContainer = document.getElementById("agentassist-maincontainer");
      if (agentAssistContainer) {
        while (agentAssistContainer.firstChild) {
          agentAssistContainer.removeChild(agentAssistContainer.lastChild);
        }
      }
      original(payload);
      // Only alter chat tasks:
      // if( payload.task.taskChannelUniqueName !== "chat" ) {
      //     original(payload);
      // } else {
      //     return new Promise(function(resolve, reject) {
      //       // Send the message:
      //       flex.Actions.invokeAction("SendMessage", {
      //         body: 'Thanks for chatting. Your session is now closed.',
      //         channelSid: payload.task.attributes.channelSid
      //       }).then(response => {
      //         // Wait until the message is sent to wrap-up the task:
      //         resolve(original(payload));
      //     });
      //   });
      // }
    });


    

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
