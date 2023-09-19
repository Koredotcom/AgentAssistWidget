export const CHECKLISTCNST = {
    COLORS: {
        '#0BA5EC': '#F0F9FF',
        '#06AED4': '#ECFDFF',
        '#2E90FA': '#EFF4FF',
        '#6172F3': '#EEF4FF',
        '#6172F3f': '#F5F3FF',
        '#EE46BC': '#FDF4FF',
        '#F63D68': '#FFF1F3',
        '#669F2A': '#F5FBEE',
        '#16B364': '#EDFCF2',
        '#FF4405': '#FFF4ED'
    },
    primary: 'primary',
    dynamic: 'dynamic',
    triggeryBy : {
        false : {
            agentAdherence : {
                title : 'Check Agent’s Adherence',
                desc : 'dynamically check for agent’s compliance with this step using Utterances, Dialogs or Context Variables.'
            },
            utterance : {
                title : 'By Agent’s Utterance',
                desc : 'Listen for specific utterances by an agent to mark as completed'
            },
            utterance_text : 'Type an utterance that an agent might say...',
            execution : {
                title : 'By Dialog Execution',
                desc : 'Watch for a dialog execution run by an agent to mark as completed'
            }
        },
        true : {
            utterance : {
                title : "By Customer's Utterance",
                desc : 'Listen for specific utterances by the customer to trigger this Playbook'
            },
            utterance_text : 'Type an utterance that the customer might say...',
            execution : {
                title : 'By Dialog Execution',
                desc : 'Watch for a dialog execution run by an agent to trigger this Playbook'
            }
        }
    }
}