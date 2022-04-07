import { DeflectAppConfig } from './configurations.model';

export const DEFLECT_CONFIG: DeflectAppConfig = {
  deflectConfiguration: {
    type: 'IVR',
    IVR: {
      completed: false
    },
    phoneNumber: {
      completed: false
    },
    voiceChannel: '',
    asrPreference: '',
    ttsPreference: '',
    voicePreference: '',
    previewVoiceEnabled: false,
    sipDomainConfigDetails: {
      sipDomainName: '',
      sipURI: '',  
      incomingIpAddresses: [],
      languagePreference: 'en_US',
      didNumber: [], 
      sipTransportType: '',
      sipHost: '', // optional
      sipUserName : '', //optional
      sipPassword : '' //optional
    },
    phoneNumberConfigDetails: {
      countryCode: '',
      phoneNumber: '',
    }
  },
  virtualAssistant: {
    type: 'voice',
    enabled: true,
    voice: {
      completed: false
    },
    chat: {
      completed: false
    }
  },
  handOff: {
    formSubmission: true,
    liveAgent: true,
    isAgentDetailsCompleted: false,
    formSubmissionType: "agentEmail",
    isFormCompleted: false,
    formDetails: {
      formName: '',
      agentEmail: '',
      payloadFields: [
        // {
        //   name: 'email',
        //   displayName: 'Email ID',
        //   helpText: '',
        //   type: 'email',
        //   dataType: 'string',
        //   placeholder: 'Placehoder text',
        //   isOptional: true,
        //   isMultiSelect: false
        // },
        // {
        //   name: 'query',
        //   displayName: 'Query',
        //   helpText: '',
        //   type: 'textarea',
        //   dataType: 'string',
        //   placeholder: 'Please enter your query',
        //   isOptional: true,
        //   isMultiSelect: false
        // },
        // {
        //   name: 'description',
        //   displayName: 'Description',
        //   helpText: '',
        //   type: 'textarea',
        //   dataType: 'string',
        //   placeholder: 'Please describe your issue',
        //   isOptional: true,
        //   isMultiSelect: false
        // }
      ]
    }
  }
}