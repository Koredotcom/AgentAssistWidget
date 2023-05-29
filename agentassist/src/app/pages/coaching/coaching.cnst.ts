export const COACHINGCNST = {
    CREATE : 'create',
    EDIT : 'edit',
    DELETE : 'delete',
    UTTERANCE : 'utterance',
    SPEECH_ANALYSIS : 'speech analysis',
    VARIABLE : 'variable',
    DIALOG : 'dialog',
    DELETE_RULE : {
        title : "Delete Rule",
        desc : "Are you sure you want to delete Negotiation?",
        type : "rule"
    },
    SPEECH_TYPE : {
        crossTalk: 'Cross Talk', 
        deadAir: 'Dead Air', 
        speechSpeed: 'Speech Speed'
    },
    OCCURENCES : [1,2,3,4,5],
    SELECTED_TIMER : 30,
    SELECTED_OCCURENCE : 1,
    USER_LIST : ['agent', 'customer'],
    OPERATOR_LIST : ['and', 'or'],
    AND_OPERATOR : 'and',
    OR_OPERATOR : 'or',
    NUDGE_AGENT: 'Nudge Agent',
    HINT_AGENT: 'Hint Agent',
    ALERT_MANAGER: 'Alert Manager',
    EMAIL_MANAGER: 'Email Manager',
    FAQ: 'FAQ',
    TYPE_OF_HINT: [{
        type: 'Positive',
        class: '' 
    },{
        type: 'Neutral',
        class: 'neutral' 
    },{
        type: 'Alert',
        class: 'alertbg' 
    },{
        type: 'Critical',
        class: 'critical' 
    }],
    TYPE_OF_CLOSE: [
        "Does not auto close",
        "Auto close"
    ],
    RULE : "rule",
    GROUP : "group"
}