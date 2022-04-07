export interface OnboardingConfig {
    name: '',
    icon: '',
    deflectAppStatus: {
        deflectConfiguration: {
            type: 'IVR' | 'phoneNumber' | '';
        },
        virtualAssistant: {
            enabled: boolean,
            type: 'voice' | 'chat' | '';
        },
        handOff: {
            liveAgent: boolean,
            formSubmission: boolean
        }
    }
}