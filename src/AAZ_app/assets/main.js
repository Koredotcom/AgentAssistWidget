
var client = ZAFClient.init();
var iframeURL = null;

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

function base64url(source) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}


async function generateURL(settings) {
  return new Promise(async (resolve, reject) => {

    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };

    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);

    const data = {
      'iss': settings.clientId,
      'sub': 'number',
      'botId': settings.botId,
    }


    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);

    var token = encodedHeader + "." + encodedData;

    var secret = settings.clientSecret;
    var signature = CryptoJS.HmacSHA256(token, secret);
    signature = base64url(signature);

    var signedToken = token + "." + signature;
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
    iframeURL = `${settings.agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${signedToken}&botid=${settings.botId}&agentassisturl=${smartassistURL}&conversationid=${activeConversationId}&isCall=${isCall}&customdata=${customdata}`;
    resolve(iframeURL);

  });
}

async function iframeRender(url) {

  document.getElementById("agentassist-iframe").src = url;

}


async function main() {


  // var iframeURL = "";
  client.invoke('resize', { width: '100%', height: '500px' });
  var activeConversationId = await getTicketId(client);

  var metadata = await client.metadata();

 console.log(_metadata);
  client.on('ticket.save', async function () {
    let response = await client.get('ticket.status');
    if (response['ticket.status'] === "solved") {
      //Emit the conversation event.
      let conversation = await client.get("ticket.conversation");

      let chatHistory = conversation['ticket.conversation'].reduce((acc, current) => {
        let obj = {};
        obj['type'] = current.author.role === "admin" ? "agent" : current.author.role === "end-user" ? "user" : "Invalid";
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
    return true
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
      let summary = JSON.parse(JSON.stringify(event.data)).payload.summary[0].summary_text;
      // let chatTranscript = JSON.parse(JSON.stringify(event.data)).conversationId;

      client.set('ticket.customField:conversation_summary', summary)

    }
  }, false);
}

main();