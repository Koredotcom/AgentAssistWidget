export interface Variable {
    hint: string;
    isDeflect: boolean;
    key: string;
    propagateValue: boolean;
    scope: string;
    state: string;
    vNameSpace: string [];
    value: string;
    variableType: string;
}

export interface ConvertBot {
    accountId: string;
    createdBy: string;
    defaultLanguage: string;
    description: string;
    dialogsCount: number;
    faqsCount: number;
    icon: string;
    isDeflect: boolean;
    name: string;
    status: string;
    _id: string;
}