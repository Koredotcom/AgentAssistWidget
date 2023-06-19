export const COACHINGCNST = {
    CREATE : 'create',
    EDIT : 'edit',
    DELETE : 'delete',
    UTTERANCE : 'utterance',
    SPEECH_ANALYSIS : 'speech_analysis',
    VARIABLE : 'variable',
    DIALOG : 'dialog_task',
    SPEECH_TYPE : {
        cross_talk: 'Cross Talk', 
        deadair: 'Dead Air', 
        speech_speed: 'Speech Speed'
    },
    CROSSTALK : 'cross_talk',
    DEADAIR : 'deadair',
    SPEECHSPEED : 'speech_speed',
    OCCURENCES : [1,2,3,4,5],
    SELECTED_TIMER : 30,
    SELECTED_WORDCOUNT : 180,
    SELECTED_OCCURENCE : 1,
    USER_LIST : ['agent', 'customer'],
    OPERATOR_LIST : ['and', 'or'],
    AND_OPERATOR : 'and',
    OR_OPERATOR : 'or',
    NUDGE_AGENT: 'nudge',
    HINT_AGENT: 'hint',
    ASSIGN : 'assign',
    ALERT_MANAGER: 'Alert Manager',
    EMAIL_MANAGER: 'Email Manager',
    FAQ: 'FAQ',
    TYPE_OF_HINT: [{
        type: 'positive',
        class: '' 
    },{
        type: 'neutral',
        class: 'neutral' 
    },{
        type: 'alert',
        class: 'alertbg' 
    },{
        type: 'critical',
        class: 'critical' 
    }],
    AUTO_CLOSE : 'auto_close',
    DOES_NOT_AUTO_CLOSE : 'doesnot_auto_close',
    TYPE_OF_CLOSE: {
        "doesnot_auto_close" : "Does not auto close",
        "auto_close" : "Auto Close"
    },
    RULE : "rule",
    GROUP : "group",
    VALIDATORS : {
        'cross_talk' : ['nOccurrences'],
        'deadair' : ['nOccurrences','timeTaken'],
        'speech_speed' : ['nOccurrences', 'nWords']
    }
}