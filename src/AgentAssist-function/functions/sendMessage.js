exports.handler = function(context, event, callback) {
    // Add the NodeJS Helper Library by calling context.getTwilioClient()
    const client = context.getTwilioClient();
    var jwt = require('jsonwebtoken');
    var request = require('request');

    console.log("====> inside function ", JSON.stringify(event));

    // Create a custom Twilio Response 
    // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Use the NodeJS Helper Library to make an API call.
  
    let agentassistURL = process.env.agentassistURL;
    let smartassistURL = agentassistURL.replace("agentassist", "smartassist")
      const data = { 
              'iss'            : process.env.clientId,
              'sub'            : event.identity,
              'aud'            : process.env.aud,
              'botId'          : process.env.botId,
              'isAnonymous'    : process.env.isAnonymous
              
          }
          let token = jwt.sign(data, process.env.clientSecret, { algorithm: 'HS256' }, {expiresIn: '1d'});
          console.log("Token from sts ====>", token);
            let baseUrl = process.env.agentassistURL;
            baseUrl = baseUrl.replace("agentassist", "smartassist");
            console.log(`======>, agentId: ${event.agentId}, conversationId:${event.conversationId}`);
            console.log(`==> query: ${JSON.stringify(event.query)}`);

            var options = {
            'method': 'POST',
            'url': `${baseUrl}/agentassist/api/v1/hooks/${process.env.botId}`,
            'headers': {
                'token': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "agentId": `${event.agentId}` || "1000",
                "botId": `${process.env.botId}`,
                "conversationId": `${event.conversationId}` || "1000",
                "query": `${event.query}`|| "connection"
            })

            };
            request(options, function (error, _response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            response.appendHeader('Content-Type', 'application/json');
            response.setBody({'body':_response.body});

            callback(null, response);
            });
          // Return a success response using the callback function.
          
  
  };