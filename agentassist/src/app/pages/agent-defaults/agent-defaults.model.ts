export type DefExperience = 'VOICE' | 'CHAT';

export type DefType = 'OFF_WORKING_HOURS' | 'NO_AVAILABLE_AGENTS' | 'HOLD_AUDIO';

export type asyncAfterMessage = 'END_CHAT' | 'ADD_TO_QUEUE ';

export type liveAfterMessage = 'END_CHAT' | 'END_CHAT_WITH_EMAIL';

export interface DefMessage {
    language: string;
    message: string;
    isActive?: boolean;
}

export interface AudioFile {
    name: string;
    fileId: string;
    audioUrl: string;
    isActive: boolean;
}

export interface OffWorking {
    orgId: string;
    experience: 'VOICE' | 'CHAT';
    type: "OFF_WORKING_HOURS";
    message: {
        locale: DefMessage[]
    }
}

export interface NoAvail {
    orgId: string;
    experience: 'VOICE' | 'CHAT';
    type: "NO_AVAILABLE_AGENTS";
    messagingConfig:{
        noMatchBehaviour: 'RUN_AUTOMATION' | 'SEND_TO_AGENT_GROUP' | 'MESSAGE';
        message?: {
            locale: DefMessage[]
        };
        automationInfo?: [
            {
                botId: string,
                dialogId: string
            }
        ]
    },
    liveChatConfig: {
        noMatchBehaviour: 'RUN_AUTOMATION' | 'SEND_TO_AGENT_GROUP' | 'MESSAGE';
        message?: {
            locale: DefMessage[]
        };
        automationInfo?: [
            {
                botId: string,
                dialogId: string
            }
        ]
    }
}

export interface ChatOffWorking {
    experience: "CHAT",
    type: "OFF_WORKING_HOURS",
    orgId: string,
    createdBy?: string,
    createdAt?: string,
    updatedAt?: string,
    id?: string,
    liveChatConfig: {
        message: {
            locale: [
                {
                    language: string,
                    message: string,
                    isActive: boolean
                }
            ]
        },
        afterMessage: liveAfterMessage
    },
    messagingConfig: {
        message: {
            locale: [
                {
                    language: string,
                    message: string,
                    isActive: true
                }
            ]
        },
        afterMessage: asyncAfterMessage,
        emailId: string
    }
}

export interface HoldAudio {
    orgId: string;
    experience: 'VOICE' | 'CHAT';
    type: 'HOLD_AUDIO';
    audioFiles: AudioFile[];
}

export interface Dialog {
    dialogId: string;
    dialogRefId: string;
    name: string;
    streamId?: string;
    state?: string;
    type?: string
}
export interface BotsNDialogs {
    streamId: string;
    name: string;
    dialogs: Dialog[],
    CSATDialogs: Dialog[],
    selectedCsatDialog?: Dialog;
    selectedDialog?: Dialog;
    disableDialog?: boolean;
}

export interface csatDialog {
    streamId: string;
    name: string;
    dialogId: string;
    dialogRefId: string;
}

export interface Language {
    label: string;
    language: string;
    accessLevel: {
        agent: boolean;
        callAutomation: boolean;
        chatAutomation: boolean;
    }
}
export interface EmailOffWorkingMessage {
    language: string;
    isActive?: boolean;
    subject: string;
    body: string;
}