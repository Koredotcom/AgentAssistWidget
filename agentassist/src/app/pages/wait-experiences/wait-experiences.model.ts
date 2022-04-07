export interface Rule {
    entity: string;
    values: string [];
    order: number;
    operator: 'OR' | 'AND';
    entityDetails?: {id: string, name: string};
    valueDetails?: {id: string, name: string} [];
}

export interface RoutingRule {
    steps: Rule [];
    operator: 'OR' | 'AND';
    order: number;
}

export interface Message {
    message: string;
    language: string;
    isActive?: boolean
}

export interface MessageOrder {
    order: number;
    locale: Message [];
    periodicLocale: Message [];
    isEdit?: boolean;
}

export interface WaitExpShort {
    configuration: {
        description: string;
        routingRules: RoutingRule []
    };
    createdAt: string;
    createdBy: string;
    id: string;
    orgId: string;
    status: string;
    updatedAt: string;
    isDefault?: boolean;
}
export interface WaitExperiences {
    configuration: {
        name: string;
        description: string;
        routingRules: RoutingRule [];
    };
    callExperience: {
        initialMessageEnabled: boolean;
        initialMessageSettings: {
            locale: Message [];
            isEdit?: boolean;
        };
        holdAudio: {
            name: string;
            id: string;
        };
        periodicMessageEnabled: boolean;
        periodicMessageSettings: {
            duration: number;
            order: 'RANDOM' | 'SEQUENCE';
            play_style: 'LOOPED' | 'NOT_LOOPED';
            messages: MessageOrder [];
        }
        chatDeflectionEnabled: boolean,
        chatDeflectionSettings: {
            toneMap: number,
            estimatedWaitTime: number,
            timeToDeflect: number,
            isEdit?: boolean,
            locale: Message []
        },
        callBackEnabled: boolean,
        callBackSettings: {
            toneMap: number;
            estimatedWaitTime: number;
            timeToCallBack: number;
            locale: Message [];
            operationType: 'OFFER' | 'FORCE';
        }
    };
    chatExperience: {
        initialMessageEnabled: boolean;
        initialMessageSettings: {
            locale: Message [];
            isEdit?: boolean;
        };
        periodicMessageEnabled: boolean;
        periodicMessageSettings: {
            duration: number;
            order: 'RANDOM' | 'SEQUENCE';
            play_style: 'LOOPED' | 'NOT_LOOPED';
            messages: MessageOrder [];
        }
    },
    isDefault?: boolean;
}

export interface WaitExpRsp {
  hasMore: boolean;
  limit: number;
  skip: number;
  totalPages: number;
  totalResults: number;
  results: WaitExperiences [];
}


export interface SkillLite  {
    name: string;
    skillGroupName: string;
    color: string;
    _id: string;
}

export const EMPTY_WAIT_EXP: WaitExperiences = {
    configuration: {
        name: "",
        description: "",
        routingRules: [
            {
                steps: [
                    {
                        entity: "",
                        values:[],
                        order: 1,
                        operator: 'OR'
                    }
                ],
                operator: 'AND',
                order: 1
            }
        ]
    },
    callExperience: {
        initialMessageEnabled: true,
        initialMessageSettings: {
            locale: [{
                message: 'Please hold while I find the right agent for you.',
                language: 'en',
                isActive: true
            },{
                message: '',
                language: 'es',
                isActive: false
            },{
                message: '',
                language: 'fs',
                isActive: false
            }]
        },
        holdAudio: {
            name: "",
            id: ""
        },
        periodicMessageEnabled: true,
        periodicMessageSettings: {
            duration: 10,
            order: 'RANDOM',
            play_style: "LOOPED",
            messages: [{
                order: 0,
                locale: [
                    {
                        message: "Please hold while I find the right agent for you.",
                        language: "en",
                        isActive: true
                    },{
                        message: '',
                        language: 'es',
                        isActive: false
                    },{
                        message: '',
                        language: 'fs',
                        isActive: false
                    }
                ],
                periodicLocale: [
                    {
                        message: "Please hold while I find the right agent for you.",
                        language: "en",
                        isActive: true
                    },{
                        message: '',
                        language: 'es',
                        isActive: false
                    },{
                        message: '',
                        language: 'fs',
                        isActive: false
                    }
                ]
            }]
        },
        chatDeflectionEnabled: true,
        chatDeflectionSettings: {
            toneMap: 1,
            estimatedWaitTime: 10,
            timeToDeflect: 10,
            isEdit: false,
            locale: [
                {
                    message: "Rather than waiting for a voice agent, it might be much faster to get an agent on chat to help you. If you would like to switch to chat, press 1 anytime during your wait and i can help you with that.",
                    language: "en",
                    isActive: true
                },{
                    message: '',
                    language: 'es',
                    isActive: false
                },{
                    message: '',
                    language: 'fs',
                    isActive: false
                }
            ]
        },
        callBackEnabled: true,
        callBackSettings: {
            toneMap: 1,
            estimatedWaitTime: 10,
            timeToCallBack: 10,
            locale: [
                {
                    message: "Looks like it might take a while for an agent to become available. If you prefer, we could hold your place in the queue and call you back as soon as an agent becomes available. To choose the call back option, press 2 at anytime during your wait.",
                    language: "en",
                    isActive: true
                },{
                    message: '',
                    language: 'es',
                    isActive: false
                },{
                    message: '',
                    language: 'fs',
                    isActive: false
                }
            ],
            operationType: "OFFER"
        }
    },
    chatExperience: {
        initialMessageEnabled: true,
        initialMessageSettings: {
            locale: [
                {
                    message: "Please hold while I find the right agent for you.",
                    language: "en",
                    isActive: true
                },{
                    message: '',
                    language: 'es',
                    isActive: false
                },{
                    message: '',
                    language: 'fs',
                    isActive: false
                }
            ]
        },
        periodicMessageEnabled: true,
        periodicMessageSettings: {
            duration: 10,
            order: 'RANDOM',
            play_style: "LOOPED",
            messages: [{
                order: 1,
                locale: [
                    {
                        message: "Please hold while I find the right agent for you.",
                        language: "en",
                        isActive: true
                    },{
                        message: '',
                        language: 'es',
                        isActive: false
                    },{
                        message: '',
                        language: 'fs',
                        isActive: false
                    }
                ],
                periodicLocale: [
                    {
                        message: "Please hold while I find the right agent for you.",
                        language: "en",
                        isActive: true
                    },{
                        message: '',
                        language: 'es',
                        isActive: false
                    },{
                        message: '',
                        language: 'fs',
                        isActive: false
                    }
                ]
            }]
        }
    }
}

