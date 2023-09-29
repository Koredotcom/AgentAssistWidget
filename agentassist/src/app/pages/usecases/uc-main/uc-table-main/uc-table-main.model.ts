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
