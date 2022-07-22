exports.handler = function(context, event, callback) {
  // Add the NodeJS Helper Library by calling context.getTwilioClient()
  const client = context.getTwilioClient();
  var jwt = require('jsonwebtoken');

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
        const token = jwt.sign(data, process.env.clientSecret, { algorithm: 'HS256' }, {expiresIn: '1d'});
        response.appendHeader('Content-Type', 'application/json');
        
        response.setBody({'token': token,
                          'agentassistURL' : agentassistURL,
                          'smartassistURL' : smartassistURL,
                          'botId'          : process.env.botId,
                          'conversationid' : process.env.conversationid});
        // Return a success response using the callback function.
        callback(null, response);

};