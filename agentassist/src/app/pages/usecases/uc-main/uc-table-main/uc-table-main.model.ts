export const USECASES_LIMIT: number = 50;

export type GroupBy = '' | 'category' | 'state';

export class UsecaseRow {
    name: string;
    category: string;
    utterances: string[];
    type: string;
}

export class ExpResponse {
  msgTempId?: string;
  answer: string;
}

export class UsecasesR {
  defaultConfigs: {
    callPreTransferMsg: string,
    chatPreTransferMsg: string
  };
  usecases: UsecaseOb[]
}

export interface UsecaseOb {   
    state: string;
    usecaseName: string;
    category: string;
    isEnabled?: boolean;
    categoryColor: string;
    usecaseType: 'faq' | 'dialog';
    taskRefId: string;
    dialogId?: string;
    callExperience: {
        isConfigured?: boolean,
        settings: {
          chat: "" | "deflection" | "agentTransfer",
          chatPreTransferMsgType?: 'default' | 'custom' | '';
          chatPreTransferMsgs?: string[]
        },
        preTransferMsgType?: 'custom' | 'default';
        type?: 'automatedDialog' | 'agentTransfer' | 'deflection';
        preTransferMsgs?: string[];
        skills?: string[];
        // responses?: ExpResponse[];
        responses?: any[];
    };
    chatExperience: {
        isConfigured?: boolean,
        settings: {},
        skills?: string[];
        type?: 'automatedDialog' | 'agentTransfer',
        preTransferMsgType?:  'default' | 'custom' | '',
        preTransferMsgs?: string[];
        // responses?: ExpResponse[];
        responses?: any[];

    };
    utterances:  {
        primary: any,
        alternates: any []
    },
    oldUtterances?: any;
}

export class UsecaseParams {
  streamId: string;
  search: string;
  filterby: string;
  status: '' | 'configured' | 'published';
  usecaseType: 'faq' | 'dialog' | 'exp';
  offset: number;
  limit: number;
  forpub: boolean;
  constructor(stId: string, srch:string , flter: string, stus: '' | 'configured' | 'published', ucType: 'faq' | 'dialog' | 'exp', off: number, lim: number, forpub?: boolean) {
    this.streamId = stId;
    this.search = srch;
    this.filterby = flter;
    this.status = stus;
    this.usecaseType = ucType;
    this.offset = off;
    this.limit = lim;
    this.forpub = forpub;
  }
}


export class UsecaseRespStruct {
    count: number;
    moreAvailable: boolean;
    usecases: UsecaseOb [];
    defaultConfigs?: {
      callPreTransferMsg: string;
      chatPreTransferMsg: string;
      chatAutomationOptMsg: string;
      chatAgentOptMsg: string;
    }
}

export interface Category {
    category: string;
    colorCode: string;
    faqCount?: number;
    dialogCount?: number;
}

export class Usecase {
    usecaseType: string;
    usecaseName: string;
    category: string;
    categoryColor: string;
}


export const MOCK_USECASES_RESPONSE: UsecaseRespStruct = {
    "count": 2,
    "moreAvailable": false,
    "usecases": [
      {
        "state": "",
        "usecaseName": "second UsecaseName",
        "category": "Investment",
        "categoryColor": "#0D6EFD",
        "usecaseType": "dialog",
        "taskRefId": "ta-erew2893werer98293",
        "callExperience": {
          "isConfigured": false,
          "type": "agentTransfer",
          "preTransferMsgType": "custom",
          "settings": {
            "chat": "deflection"
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "chatExperience": {
          "isConfigured": true,
          "type": "automatedDialog",
          "settings": {
            "chat": ""
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
          "this is alternate answer1",
          "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "First usecase",
        "category": "General",
        "usecaseType": "faq",
        "categoryColor": "#7027E5",
        "taskRefId": "ta-eroe92dr323",
        "callExperience": {
          "isConfigured": true,
          "settings": {
          "chat": ""
          },
          "responses": [
            {
              "msgTempId": "ms-382303hd",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df2303hd",
              "answer": "This is response 2"
            }
          ]
        },
        "chatExperience": {
          "isConfigured": false,
          "settings": {},
          "type": "automatedDialog",
          "responses": [
            {
              "msgTempId": "ms-382303hwed",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df23013hd",
              "answer": "This is response 2"
            }
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
            "this is alternate answer1",
            "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "second UsecaseName",
        "category": "Investment",
        "categoryColor": "#0D6EFD",
        "usecaseType": "dialog",
        "taskRefId": "ta-erew2893werer98293",
        "callExperience": {
          "isConfigured": false,
          "type": "agentTransfer",
          "preTransferMsgType": "custom",
          "settings": {
            "chat": "deflection"
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "chatExperience": {
          "isConfigured": true,
          "type": "automatedDialog",
          "settings": {
            "chat": ""
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
          "this is alternate answer1",
          "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "First usecase",
        "category": "General",
        "usecaseType": "faq",
        "categoryColor": "#7027E5",
        "taskRefId": "ta-eroe92dr323",
        "callExperience": {
          "isConfigured": true,
          "settings": {
          "chat": ""
          },
          "responses": [
            {
              "msgTempId": "ms-382303hd",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df2303hd",
              "answer": "This is response 2"
            }
          ]
        },
        "chatExperience": {
          "isConfigured": false,
          "settings": {},
          "type": "automatedDialog",
          "responses": [
            {
              "msgTempId": "ms-382303hwed",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df23013hd",
              "answer": "This is response 2"
            }
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
            "this is alternate answer1",
            "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "second UsecaseName",
        "category": "Investment",
        "categoryColor": "#0D6EFD",
        "usecaseType": "dialog",
        "taskRefId": "ta-erew2893werer98293",
        "callExperience": {
          "isConfigured": false,
          "type": "agentTransfer",
          "preTransferMsgType": "custom",
          "settings": {
            "chat": "deflection"
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "chatExperience": {
          "isConfigured": true,
          "type": "automatedDialog",
          "settings": {
            "chat": ""
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
          "this is alternate answer1",
          "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "First usecase",
        "category": "General",
        "usecaseType": "faq",
        "categoryColor": "#7027E5",
        "taskRefId": "ta-eroe92dr323",
        "callExperience": {
          "isConfigured": true,
          "settings": {
          "chat": ""
          },
          "responses": [
            {
              "msgTempId": "ms-382303hd",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df2303hd",
              "answer": "This is response 2"
            }
          ]
        },
        "chatExperience": {
          "isConfigured": false,
          "settings": {},
          "type": "automatedDialog",
          "responses": [
            {
              "msgTempId": "ms-382303hwed",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df23013hd",
              "answer": "This is response 2"
            }
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
            "this is alternate answer1",
            "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "second UsecaseName",
        "category": "Investment",
        "categoryColor": "#0D6EFD",
        "usecaseType": "dialog",
        "taskRefId": "ta-erew2893werer98293",
        "callExperience": {
          "isConfigured": false,
          "type": "agentTransfer",
          "preTransferMsgType": "custom",
          "settings": {
            "chat": "deflection"
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "chatExperience": {
          "isConfigured": true,
          "type": "automatedDialog",
          "settings": {
            "chat": ""
          },
          "preTransferMsgs": [
            "this is pretransfer message1",
            "this is pretransfer message2"
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
          "this is alternate answer1",
          "this is alternate answer2"
          ]
        }
      },
      {
        "state": "",
        "usecaseName": "First usecase",
        "category": "General",
        "usecaseType": "faq",
        "categoryColor": "#7027E5",
        "taskRefId": "ta-eroe92dr323",
        "callExperience": {
          "isConfigured": true,
          "settings": {
          "chat": ""
          },
          "responses": [
            {
              "msgTempId": "ms-382303hd",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df2303hd",
              "answer": "This is response 2"
            }
          ]
        },
        "chatExperience": {
          "isConfigured": false,
          "settings": {},
          "type": "automatedDialog",
          "responses": [
            {
              "msgTempId": "ms-382303hwed",
              "answer": "This is response 1"
            },{
              "msgTempId": "ms-38df23013hd",
              "answer": "This is response 2"
            }
          ]
        },
        "utterances": {
          "primary": "this is primary answer",
          "alternates": [
            "this is alternate answer1",
            "this is alternate answer2"
          ]
        }
      }
    ]
}
