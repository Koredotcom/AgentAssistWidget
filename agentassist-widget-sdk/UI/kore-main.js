(function ($) {
    var agentID, botID,conversationId=''; 
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
                        if (koreBot && koreBot.applySDKBranding) {
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
        function onJWTGrantSuccess(options) {
            getBrandingInformation(options);
        }
        var chatConfig = window.KoreSDK.chatConfig;
        function initAgentAssist(){
        chatConfig.botOptions.assertionFn = assertion;
        chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
        var koreBot = koreBotChat();
        koreBot.show(chatConfig);

        function koreGenerateUUID() {
            console.info("generating UUID");
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }

        if (chatConfig.agentAssist) {
            var korecookie = localStorage.getItem("korecom");
            var userID = (korecookie) || koreGenerateUUID();
            var webSocketConnection = {
                "path": "/agentassist/api/v1/chat/", transports: ['websocket', 'polling', 'flashsocket']
            };

            var connectionObj = {
                envinormentUrl: chatConfig.agentAssistUrl,
                webSocketConnectionDomain: chatConfig.agentAssistUrl + "/koreagentassist",
                webSocketConnectionDetails: webSocketConnection,
                botDetails: chatConfig.botOptions,
                isAuthentication: true
            }
             agentID = koreGenerateUUID();
             conversationId = (new Date()).getTime()+'';
            $('#details').val(`AgentID: ${agentID}\n\rUserID: ${userID}\n\rConversationID: ${conversationId}`);
            botID =  $(`#botid`).val()? $(`#botid`).val(): chatConfig.botOptions.botInfo._id;


            let agentAssistObj = new AgentAssist('agent-assist-chat-container',conversationId , botID, connectionObj);

            let userIds;
            userIds = agentAssistObj._conversationId + '_' + agentAssistObj.userId + '_' + agentAssistObj.botId;
            let agentObj = {};
            agentObj[userIds] = agentAssistObj;
            // if(sessionStorage.getItem('users') == null){
            //     sessionStorage.setItem('users', '{}');
            // }


            // window.onbeforeunload= function(){
            //     let old_users = {};

            //     old_users = JSON.parse(sessionStorage.getItem('users'));
            //     let splitRes = userIds.split('_');
            //     old_users[userIds]=$(`#userIDs-${splitRes[0]}`).html();
            //     // sessionStorage.setItem('users', JSON.stringify(old_users));             
            // }

            //    $(document).ready(function(){
            //         let result = JSON.parse(sessionStorage.getItem('users'));
            //         for(let res in result){
            //             let splitRess = res.split('_');
            //             let bodyContainer = $(`#userIDs-${splitRess[0]}`);

            //             if(splitRess[0]==(userIds.split('_')[0])){
            //                 bodyContainer.html(result[res]);
            //                var hasVerticalScrollbar = $('.agent-assist-chat-container').scrollHeight - 3 > $('.agent-assist-chat-container').clientHeight;
            //                if(!hasVerticalScrollbar){
            //                 var KRPerfectScrollbar;
            //                 if(window.PerfectScrollbar && typeof PerfectScrollbar ==='function'){
            //                 KRPerfectScrollbar=window.PerfectScrollbar;
            //                 }
            //                 new KRPerfectScrollbar($('.agent-assist-chat-container').find('.body-data-container').get(0), {
            //                     suppressScrollX: true
            //                 });
            //                }

            //             } 
            //         }
            //    });

        }

        $('.openChatWindow').click(function () {
            koreBot.show(chatConfig);
        });
     }
     $('#botid').val(chatConfig.botOptions.botInfo._id)
     $('#connect').click(()=>{
         initAgentAssist();
     });
    //  need to change the Token by using the current bot clientId and client sceret
     $('#sendMsg').click(() => {
        let msg = $('#userInput').val();
        console.log("--------->"+msg);
        let payload = {
            "agentId": agentID,
            "botId": botID,
            "conversationId": conversationId,
            "query" : msg,
        }
        $.ajax({
            url: 'https://dev-smartassist.kore.ai/agentassist/api/v1/hooks/st-6e9d43c3-33f6-5b44-a8c3-5dfe5d08ffd1',
            type: 'POST',
            crossDomain: true,
            contentType: 'application/json',
            headers: {
               'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTMzMTA0MTkxNjYsImV4cCI6MTY1MzM5NjgxOTE2NiwiYXVkIjoiaHR0cHM6Ly9pZHByb3h5LmtvcmUuY29tL2F1dGhvcml6ZSIsImlzcyI6ImNzLTdmZTQ2NmUyLWE3ZWItNTIwMS04NGZlLTE4Mjk5NmExY2Q3NSIsInN1YiI6InVhLWJiZjA1ZjQwLTcyMmMtNDllZS1iMDc0LTllZDk4YTYzMDg2YiIsImlzQW5vbnltb3VzIjoiZmFsc2UifQ.U3HUQM7qHekA7IXT3fewCx9tzADt_DXd08oggvHQos0',
               "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
            },
            data:  JSON.stringify(payload),
            dataType: "json",
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                console.log(error);
            }
         });
         $('#userInput').val('');
    })
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));