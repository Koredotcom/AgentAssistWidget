import { FormField } from './form-field.model';

export interface DeflectAppConfig {
    deflectConfiguration: {
        type: 'IVR' | 'phoneNumber'
        IVR: {
            completed: boolean;
        },
        phoneNumber: {
            completed: boolean;
        },
        voiceChannel: string,
        asrPreference: string,
        ttsPreference: string,
        voicePreference: string,
        previewVoiceEnabled: boolean,
        sipDomainConfigDetails: {
            sipDomainName: string,
            sipURI: string,
            incomingIpAddresses: string[],
            languagePreference: 'en_US',
            didNumber: string[],
            sipTransportType: string,
            sipHost: '', // optional
            sipUserName : '', //optional
            sipPassword : '' //optional
        },
        phoneNumberConfigDetails: {
            countryCode: string;
            phoneNumber: string;
        }
    },
    virtualAssistant: {
        type: 'voice' | 'chat'
        enabled: boolean,
        voice: {
            completed: boolean;
        },
        chat: {
            completed: boolean;
        }
    },
    handOff: {
        formSubmission: boolean,
        liveAgent: boolean,
        agentDetails?:any,
        formSubmissionType?: string;
        formDetails?: {
            formName: string,
            agentEmail: string,
            payloadFields: FormField[],
        },

        isFormCompleted?: boolean;
        isAgentDetailsCompleted?: boolean

    }
}