export const COACHINGCNST = {
    CREATE : 'create',
    EDIT : 'edit',
    DELETE : 'delete',
    UTTERANCE : 'utterance',
    ACKNOWLEDGE : 'ack',
    SPEECH_ANALYSIS : 'speech_analysis',
    VARIABLE : 'variable',
    DIALOG : 'dialog_task',
    SPEECH_TYPE : {
        cross_talk: 'Cross Talk', 
        deadair: 'Dead Air', 
        speech_speed: 'Speech Speed',
        talk_ratio : 'Talk Ratio'
    },
    CROSSTALK : 'cross_talk',
    TALKRATIO : 'talk_ratio',
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
    ALERT_MANAGER: 'alert_manager',
    EMAIL_MANAGER: 'email_manager',
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
        'cross_talk' : ['nOccurrences', 'duration'],
        'deadair' : ['nOccurrences','timeTaken', 'duration'],
        'speech_speed' : ['nOccurrences', 'nWords', 'duration'],
        'talk_ratio' : ['duration']
    },
    HINT_NUDGE_VALIDATORS : {
        'utterance' : ['session', 'utteranceCount']
    },
    HINT_NUDGE_SESSION_VALIDATORS : {
        'nMins' : ['nMins'],
        'nMessages' : ['nMessages']
    },
    UI_SESSION_LIST : {
        'anyTime' : 'Anytime',
        'nMins' : 'within',
        'nMessages' : 'within'
    },
    SESSION_LIST : {
        'anyTime' : 'Anytime',
        'nMins' : 'Within next {n} minutes',
        'nMessages' : 'Within next {n} messages'
    },
    ACTION_SESSION_ANYTIME : 'anyTime',
    ACTION_SESSION_NMINS : 'nMins',
    ACTION_SESSION_NMESSAGES : 'nMessages',

    ADHERENCE_REMOVE_LIST : {
        'ack' : ['ackText'],
        'utterance' : ['session', 'utteranceCount', 'nMins', 'nMessages'],
        'faq' : [],
        'task' : []
    },
    ADHERENCE_SELECTION_LIST : {
        'ack' : ['ackText'],
        'utterance' : ['session', 'utteranceCount'],
        'faq' : [],
        'task' : []
    },
    SELECTED_ACTION_ANYTIME : 'anyTime',
    SELECTED_ACTION_MINS : 1,
    SELECTED_ACTION_MESSAGES : 1,
    ACKNOWLEDGE_PRESSED : 'ack',
    FAQ_USED : 'faq',
    DIALOG_RUN : 'task' ,
    WHEN_TYPE : {
        "immediately" : "Immediately",
        "eod" : "Add to end of the day email"
    },
    IMMEDIATELY : 'immediately',
    GOT_IT : 'Ok, Got it',
    ADHERENCE_DATA: 'adherence',
    UTTERANCE_CONV_REMOVE_LIST : {
        'anyTime' : [],
        'byTime' : ['period', 'nSeconds'],
        'byMessageCount' : ['period', 'nMessages']
    },
    UTTERANCE_CONV_DEFAULT_SELECTION : {
        period : 'first',
        nSeconds : 30,
        nMessages : 5
    },
    TRIGGER_ANYTIME : 'anyTime',
    TRIGGER_BYTIME : 'byTime',
    TRIGGER_BYMEESAGECOUNT : 'byMessageCount',
    TRIGGER_FIRST : 'first',
    TRIGGER_WITHIN : 'withIn',
    SPEECH_DEFAULT_BY : 'agent',
    SPEECH_DEADAIR_USERLIST : ['agent', 'customer', 'both'],
    SPEECH_SPEED_USERLIST : ['agent', 'customer'],
    SPEECH_USER_LIST: {
        'agent': 'Agent',
        'both': 'Agent and Customer',
        'customer': 'Customer'
    },
    voice : 'Voice',
    chat : 'Live Chat',
    channelList : ['voice', 'chat'],
    comparator_acutal_list : ['eq', 'neq', 'lt', 'lte', 'gt', 'gte','range'],
    comparator_map : {
        'eq' : 'Equal to',
        'neq' : 'Not Equal to',
        'lt' : 'Ltss than',
        'lte' : 'Ltss than or equal to',
        'gt' : 'Greater than',
        'gte' : 'Greater than or equal to',
        'range' : 'In between'
    },
    RANGE : 'range'
}