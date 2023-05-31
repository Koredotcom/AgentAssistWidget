export const COACHINGCNST = {
    CREATE : 'create',
    EDIT : 'edit',
    DELETE : 'delete',
    UTTERANCE : 'utterance',
    SPEECH_ANALYSIS : 'speech_analysis',
    VARIABLE : 'variable',
    DIALOG : 'dialog_task',
    SPEECH_TYPE : {
        crossTalk: 'Cross Talk', 
        deadair: 'Dead Air', 
        speech_speed: 'Speech Speed'
    },
    CROSSTALK : 'crossTalk',
    DEADAIR : 'deadair',
    SPEECHSPEED : 'speech_speed',
    OCCURENCES : [1,2,3,4,5],
    SELECTED_TIMER : '30s',
    SELECTED_WORDCOUNT : '180',
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
    GROUP : "group",
    VALIDATORS : {
        'crossTalk' : ['nOccurences'],
        'deadair' : ['nOccurences','timeTaken'],
        'speech_speed' : ['nOccurences', 'nWords']
    }
}