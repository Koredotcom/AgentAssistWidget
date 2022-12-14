
var client = ZAFClient.init();
var iframeURL = null;
client.on('app.registered', function () {
  client.invoke('resize', { width: '100%', height: '80px' });
  main();
});
async function getRequesterName(client) {

  let result = await client.get("ticket.requester.name");
  if (result)
    return result['ticket.requester.name'];
  return null
}


function sendMessageToAgentAssist(conversationId, message) {
  let iframe = document.getElementById('agentassist-iframe');
  if (!iframe) {
    return;
  }
  var content = message;
  var message = {};
  message['author'] = {};
  message['author'].Id = '';
  message['author'].type = 'USER';
  message['conversationid'] = conversationId;
  message['name'] = 'agentAssist.CustomerMessage';
  message['value'] = content;
  var vfWindow = iframe.contentWindow;
  if (vfWindow) {
    vfWindow.postMessage(message, iframeURL);//window.location.protocol+'//'+window.location.host);
  }

}

async function getChannel(client) {
  let data = await client.get('ticket');
  if (data) {
    return data.ticket.via.channel;
  }
  return null;
}

async function getPhoneNumber(client) {
  let data = await client.get('ticket');
  if (data) {
    return data.ticket.requester.identities[0]['value'].replace('+', '%2B')
  }
  return null;
}

async function getTicketId(client) {

  let ticket = await client.context();
  if (ticket)
    return ticket.ticketId
  return null;
};

async function generateURL(settings) {
  return new Promise(async (resolve, reject) => {

    // Token Generation
    // const options = {
    //   url: settings.stsURL,
    //   type: "POST",
    //   dataType: "json",
    //   contentType: "application/json",
    //   secure: true,
    //   cors:false,
    //   data:JSON.stringify({clientId: "{{setting.botClientId}}",clientSecret: "{{setting.botClientSecret}}",identity: "number",aud: "https://idproxy.kore.com/authorize",isAnonymous: false})

    // }

    const options = {
      url: "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ clientId: "cs-1fe3de3f-3b95-5cff-b706-2e997726b5da", clientSecret: "gnrMxT8L0Q4jaRmIREJBX9JqGTtmNkbPYrGW/8ctfSo=", identity: "number", aud: "https://idproxy.kore.com/authorize", isAnonymous: false })


    }
    let response = await client.request(options);
    let token = response.jwt;

    let requester = await getRequesterName(client);
    let smartassistURL = settings.agentassistURL.replace("agentassist", "smartassist");
    let activeConversationId = null;
    let customdata = null;
    let channel = await getChannel(client);

    let isCall = channel == "voice_inbound" ? true : false
    if (isCall) {
      activeConversationId = await getPhoneNumber(client);
      customdata = encodeURI(JSON.stringify({ fName: 'Customer', lName: '' }));

    } else {
      activeConversationId = await getTicketId(client);
      customdata = encodeURI(JSON.stringify({ fName: requester || 'Customer', lName: '' }));

    }

    iframeURL = `${settings.agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${token}&botid=${settings.botId}&agentassisturl=${smartassistURL}&conversationid=${activeConversationId}&isCall=${isCall}&customdata=${customdata}`;
    resolve(iframeURL);


  });
}

async function iframeRender(url) {

  document.getElementById("agentassist-iframe").src = url;

}


async function main() {


  // var iframeURL = "";
  client.invoke('resize', { width: '100%', height: '476px' });
  var activeConversationId = await getTicketId(client);

  var metadata = await client.metadata();

  client.on('ticket.submit.start', async function(data) {
    let response = await client.get('ticket.status');
    if (response['ticket.status'] === "solved") {

      //Emit the conversation event.
      let conversation = await client.get("ticket.conversation");

      let chatHistory = conversation['ticket.conversation'].reduce((acc, current) => {
        let obj = {};
        obj['type'] = ["admin", "agent"].includes(current.author.role) ? "agent" : ["end-user", "customer"].includes(current.author.role) ? "user" : "Invalid";
        obj['message'] = current.message.content;
        obj['name'] = current.author.name;
        obj['timestamp'] = Date.parse(current.timestamp);
        acc.push(obj);
        return acc
      }, []);

      var message = {};
      message['payload'] = {};
      message['payload'].chatHistory = chatHistory;//JSON.parse(JSON.stringify(result)).messages;
      message['conversationId'] = activeConversationId;
      message['name'] = 'agentAssist.endOfConversation';
      let iframe = document.getElementById('agentassist-iframe');
      var vfWindow = iframe.contentWindow;
      if (vfWindow) {
        vfWindow.postMessage(message, iframeURL);//window.location.protocol+'//'+window.location.host);
      }
    }
  });


  client.on('ticket.conversation.changed', function (conversations) {

    let lastElement = conversations.pop();
    if (lastElement.author.role == "customer") {
      sendMessageToAgentAssist(activeConversationId, lastElement.message.content);
    }
  });

  let _iframeURL = await generateURL(metadata.settings);

  iframeRender(_iframeURL);

  window.addEventListener("message", async (event) => {
    // var recordId = activeConversationId;
    if (event.data.name === "agentAssist.SendMessage" && event.data.conversationId == activeConversationId) {
      var msg = '';
      try {
        msg = JSON.parse(decodeURI(event.data.payload)).message[0].cInfo.body;
      } catch (e) {
        msg = decodeURI(encodeURI(event.data.payload));
      }
      client.invoke("ticket.sendMessage", { channel: 'messaging', message: msg });


    } else if (event.data.name === "agentAssist.CopyMessage" && event.data.conversationId == activeConversationId) {
      var msg = decodeURI(encodeURI(event.data.payload));
      client.invoke('comment.appendText', msg);

    }
    else if (event.data.name === "agentAssist.conversation_summary" && event.data.conversationId == activeConversationId) {
      client.invoke('comment.appendText', msg);
      let summary = JSON.parse(JSON.stringify(event.data)).payload.summary[0].summary_text;
      // let chatTranscript = JSON.parse(JSON.stringify(event.data)).conversationId;

      client.get('ticketFields').then(function (data) {

        // Get all fields to query against
        var fields = data["ticketFields"];
        var CustomFieldName;

        // Iterate through each field
        for (var field in fields) {

          // Find the one that match
          if (fields[field].label == "Conversation Summary") {
            CustomFieldName = fields[field].name;
            client.set('ticket.customField:' + CustomFieldName, summary).then(function (data) {
              // https://SomeDomain.zendesk.com/api/v2/ticket_fields
              console.log(data); // { 'ticket.subject': 'Printer Overheating Incident' }
            });
            break;
          }
        }



      });


    }
  }, false);
}

// main();