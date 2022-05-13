(function ($) {

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
                "path": "/agentassist/api/v1/chat/", 'query': 'userId=' + userID + '&orgId=o-da05dbea-6573-5399-ba58-22035a3122f3', transports: ['websocket', 'polling', 'flashsocket']
            };

            var connectionObj = {
                webSocketConnectionDomain: chatConfig.agentAssistUrl + "/koreagentassist",
                webSocketConnectionDetails: webSocketConnection,
                botDetails: chatConfig.botOptions
            }
            let agentID = koreGenerateUUID();
            let conversationId = (new Date()).getTime()+'';
            $('#details').val(`AgentID: ${agentID}\n\rUserID: ${userID}\n\rConversationID: ${conversationId}`);
            let botID =  $(`#botid`).val()? $(`#botid`).val(): chatConfig.botOptions.botInfo._id;

            let agentAssistObj = new AgentAssist('agent-assist-chat-container',conversationId , agentID, userID, botID, connectionObj);

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
     })
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));