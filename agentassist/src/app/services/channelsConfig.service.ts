import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class channelsConfigService {

    public dynamicChannels = [];
    public channelsArray : any = [];
    public conf : any = {};
    private env_conf : any = {};

    constructor() {
        this.env_conf['context-url'] = location.origin + '/analytics/assets/images';
        this.init();
    }

    init(){
        this.conf = {
            "channels": [{
                    "id": "email",
                    "markdownDisable": []
                }, {
                    "id": "sms",
                    "markdownDisable": []
                }, {
                    "id": "kore",
                    "markdownDisable": []
                }, {
                    "id": "facebook",
                    "markdownDisable": []
                }, {
                    "id": "slack",
                    "markdownDisable": []
                }, {
                    "id": "rtm",
                    "markdownDisable": []
                }, {
                    "id": "widgetsdk",
                    "markdownDisable": []
                },{
                    "id": "skype",
                    "markdownDisable": []
                }, {
                    "id": "spark",
                    "markdownDisable": []
                }, {
                    "id": "twitter",
                    "markdownDisable": []
                }, {
                    "id": "skypeOnPrem",
                    "markdownDisable": []
                }],
            "channelName": (channelType) => {
                var channelObject = _.find(this.channelsArray, (channel : any) => {
                    return channel.id == channelType;
                });
                
                return ((channelObject && channelObject.name) || channelType);
            },
            "getchannel": function(channelType){
                var channelObject = _.find(this.channelsArray, (channel : any)=> {
                    return channel.id == channelType;
                });
                
                return channelObject;
            }     
        };
        this.conf.channelsObject = {
        "email":{
            "id": "email",
            "name": "Email",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/email.svg' 
            },
          "sms":{
            "id": "sms",
            "name": "SMS",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/twillio-red-logo.svg?v=1.1'
        }, "kore":{
            "id": "kore",
            "name": "Kore.ai",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/kore.svg'
        }, "facebook":{
            "id": "facebook",
            "name": "Facebook Messenger",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/facebook.svg'
        }, "slack":{
            "id": "slack",
            "name": "Slack",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/slack.svg'
        }, "rtm":{
            "id": "rtm",
            "name": "Web/Mobile Client",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/web-mobile.svg'
        },"widgetsdk":{
            "id": "widgetsdk",
            "name": "Widget SDK",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/widgetsdk.svg'
        }, "skype":{
            "id": "skype",
            "name": "Skype",
            "enable": false,
            "icon":this.env_conf['context-url'] + '/channelImages/skypeIcon.svg'
        }, "spark":{
            "id": "spark",
            "name": "Cisco Webex Teams",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/spark.svg'
        }, "twitter":{
            "id": "twitter",
            "name": "Twitter",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/twitter.svg'
        }, "msteams":{
            "id": "msteams",
            "name": "Microsoft Teams",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/microsoft-teams-icon.png'
        }, "wfacebook":{
            "id": "wfacebook",
            "name": "Workplace by Facebook",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/fb-workplace-icon.png'
        }, "ringcentral":{
            "id": "ringcentral",
            "name": "RingCentral Glip",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/ringCentralIcon.png'
        }, "skypeforbusiness":{
            "id": "skypeforbusiness",
            "name": "Skype for Business",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/skypebusiness.svg'
        }, "jabber":{
            "id": "jabber",
            "name": "Cisco Jabber",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/jabbericon.jpg'
        }, "wfacebookG":{
            "id": "wfacebookG",
            "name": "Workplace For Groups",
            "enable": true,
            "icon": this.env_conf['context-url'] + '/channelImages/fb-workplace-icon.png'
        }, "wfacebookC":{
            "id": "wfacebookC",
            "name": "Workplace For Chat",
            "enable": true,
            "icon": this.env_conf['context-url'] + '/channelImages/fb-workplace-icon.png'
        }, "alexa":{
            "id": "alexa",
            "name": "Amazon Alexa",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/amazonalexa.png'
        }, "twiliovoice":{
            "id": "twiliovoice",
            "name": "Twilio Voice",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/twillio-red-logo.svg?v=1.1'
        }, "yammer":{
            "id": "yammer",
            "name": "Yammer",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/yammericon.png'
        }, "telegram":{
            "id": "telegram",
            "name": "Telegram",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/telegram-logo.png'
        }, "ivr":{
            "id": "ivr",
            "name": "Webhook",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/webhook.png'
        }, "line":{
            "id": "line",
            "name": "Line",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/line-logo.png'
        }, "liveperson":{
            "id": "liveperson",
            "name": "LivePerson",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/live-person.png'
        }, "ivrVoice":{
            "id": "ivrVoice",
            "name": "IVR",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/ivr-logo.png'
        }, "googleactions":{
            "id": "googleactions",
            "name": "Google Assistant",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/google-home.svg'
        }, "whatsapp":{
            "id": "whatsapp",
            "name": "WhatsApp Business Messaging",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/whatsapp-business.svg'
        },"rcs":{
            "id": "rcs",
            "name": "RCS Business Messaging",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/rcsBusiness.png'
        }, "wechat":{
            "id": "wechat",
            "name": "WeChat",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/weChat.svg'
        }, "mattermost":{
            "id": "mattermost",
            "name": "Mattermost",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/matterMost.svg'
        }, "hangoutchat":{
            "id": "hangoutchat",
            "name": "Hangouts Chat",
            "enable": false,
            "icon": this.env_conf['context-url'] + '/channelImages/hangoutchat.png'
        }, "cisco": {
            'id': 'cisco',
            'name': 'Cisco Tropo',
            'enable': true,
            'icon': this.env_conf['context-url'] + '/channelImages/cisco-tropo-icon.png'
        }, "twilio": {
            'id': 'twilio',
            'name': 'Twilio SMS',
            'enable': true,
            'icon': this.env_conf['context-url'] + '/channelImages/twillio-red-logo.svg?v=1.1'
        }, "livebank":{
            "id": "livebank",
            "name": "LiveBank",
            "enable": true,
            "icon": this.env_conf['context-url'] + '/channelImages/livebank.png'
        }, "skypeOnPrem":{
            'id': 'skypeOnPrem',
            'name': 'Skype on Premise',
            'enable': false,
            'icon': this.env_conf['context-url'] + '/channelImages/skypebusiness.svg'
        },"unblu":{
            'id': 'unblu',
            'name': 'Unblu',
            'enable': false,
            'icon': this.env_conf['context-url'] + '/channelImages/unblu-logo.svg'
        }
    };
    var staticChannel = JSON.parse(JSON.stringify(this.conf.channelsObject));
    for(var key in staticChannel) {
            if(staticChannel[key]) {
                this.channelsArray.push(staticChannel[key]);
            }
        }
    }
}