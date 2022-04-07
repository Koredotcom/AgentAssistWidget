(function($){

    $(document).ready(function () {
        function assertion(options, callback) {
            var jsonData = {
                "clientId": options.clientId,
                "clientSecret": options.clientSecret,
                "identity": options.userIdentity,
                "aud": "",
                "isAnonymous": true
            };
            $.ajax({
                url: options.JWTUrl,
                type: 'post',
                data: jsonData,
                dataType: 'json',
                success: function (data) {
                    options.assertion = data.jwt;
                    options.handleError = koreBot.showError;
                    options.chatHistory = koreBot.chatHistory;
                    options.botDetails = koreBot.botDetails;
                    callback(null, options);
                    setTimeout(function () {
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    }, 2000);
                },
                error: function (err) {
                    koreBot.showError(err.responseText);
                }
            });
        }
        function getBrandingInformation(options) {
            if (chatConfig.botOptions && chatConfig.botOptions.enableThemes) {
                var brandingAPIUrl = (chatConfig.botOptions.brandingAPIUrl || '').replace(':appId', chatConfig.botOptions.botInfo._id);
                $.ajax({
                    url: brandingAPIUrl,
                    headers: {
                        'Authorization': "bearer " + options.authorization.accessToken,
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if(koreBot && koreBot.applySDKBranding) {
                            koreBot.applySDKBranding(data);
                        }
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }

        }
        function onJWTGrantSuccess(options){
            getBrandingInformation(options);
        }
        var chatConfig=window.KoreSDK.chatConfig;
        chatConfig.botOptions.assertionFn=assertion;
        chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
        var koreBot = koreBotChat();
        koreBot.show(chatConfig);
        if(chatConfig.agentAssist){
            new AgentAssist('agentassist-maincontainer', '123489', 'user101', chatConfig.botOptions.botInfo._id);
        }

        var _msgs={
            "type": "bot_response",
            "from": "bot",
            "message": [
                {
                    "type": "text",
                    "component": {
                        "type": "error",
                        "payload":{
                            "color":"#F35A00",
                            "text":"sample for error template"
                         }
                    },
                    "cInfo": {
                        "body": "welcome :)"
                    }
                }
            ],
            "messageId": "ms-5aba21db-6e62-5d47-b925-ef0ee1bdbd6f",
            "botInfo": {
                "chatBot": "sample Bot",
                "taskBotId": "st-defbe19d-f295-5d59-94bb-00680f2a5674"
            },
            "createdOn": "2022-03-21T07:56:18.225Z",
            "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
            "traceId": "873209019a5adc26"
        }

        $('.openChatWindow').click(function () {
            koreBot.show(chatConfig);
        });
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));