

// import config from "./config.json" assert { type: 'json' };
// import Schema from "./schema.json" assert { type: 'json' };
// import schemaData from "./data.json" assert { type: 'json' };


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
  console.log("Kore Agent Assist iframe", iframe);
  var content = message;
  console.log("New Message recordId:" + conversationId + " content:" + content);
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

async function getPhoneNumber(client){
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
      // console.log("token ==========================>", token);

      var secret = settings.clientSecret;
      var signature = CryptoJS.HmacSHA256(token, secret);
      signature = base64url(signature);

      var signedToken = token + "." + signature;
      let requester = await getRequesterName(client);
      let smartassistURL = settings.agentassistURL.replace("agentassist", "smartassist");
      let activeConversationId = null;
      let customdata = null;
      let channel = await getChannel(client);
      
      console.log("===============> channel", channel);
      let isCall = channel == "voice_inbound" ? true : false
      if(isCall){
        activeConversationId = await getPhoneNumber(client);
        customdata = encodeURI(JSON.stringify({ fName:'Customer', lName: '' }));

      }else{
        activeConversationId = await getTicketId(client);
        customdata = encodeURI(JSON.stringify({ fName: requester || 'Customer', lName: '' }));

      }
      iframeURL = `${settings.agentassistURL}/koreagentassist-sdk/UI/agentassist-iframe.html?token=${signedToken}&botid=${settings.botId}&agentassisturl=${smartassistURL}&conversationid=${activeConversationId}&isCall=${isCall}&customdata=${customdata}`;
      resolve(iframeURL);

  });
}

async function iframeRender(url) {

  console.log("Iframe URL ========> ", url);
  document.getElementById("agentassist-iframe").src = url;
  // let ticketData = await client.get('ticket');
  // console.log("ticket data =====> ", ticketData);

}


async function main() {


  // var iframeURL = "";
  client.invoke('resize', { width: '100%', height: '500px' });
  var activeConversationId = await getTicketId(client);

  var metadata = await client.metadata();

  client.on('ticket.conversation.changed', function (conversations) {
    // console.log("change event =====> ", e);
    let lastElement = conversations.pop();
    if (lastElement.author.role == "customer") {
      sendMessageToAgentAssist(activeConversationId, lastElement.message.content);
    }
  });
  let _iframeURL = await generateURL(metadata.settings);

  iframeRender(_iframeURL);

  client.on('app.registered', (event) => {
    console.log("app registered =========> ", event);
  });


  window.addEventListener("message", async (event) => {
    // console.log("Kore Agent Assist inside window eventlistener", activeConversationId, event.data);
    var recordId = activeConversationId;
    if (event.data.name === "agentAssist.SendMessage" && event.data.conversationId == activeConversationId) {
      var msg = '';
      try {
        msg = JSON.parse(decodeURI(event.data.payload)).message[0].cInfo.body;
      } catch (e) {
        msg = decodeURI(encodeURI(event.data.payload));
      }
      console.log("Kore Agent Assist sending message ===============> ", msg);
      client.invoke("ticket.sendMessage", { channel: 'messaging', message: msg });


    } else if (event.data.name === "agentAssist.CopyMessage" && event.data.conversationId == activeConversationId) {
      var msg = decodeURI(encodeURI(event.data.payload));
      console.log("Kore Agent Assist copying message ==============> ", msg);
      client.invoke('comment.appendText', msg);

    }
  }, false);
}

main();