export const ProjConstants = {
    ASSIST : 'Assist',
    MYBOT : 'My Bot',
    TRANSCRIPT : "Transcript",
    LIBRARY : 'Library',
    SETTINGS : 'Settings',
    SEARCH : 'Search',
    VOICE : 'voice',
    CHAT : 'chat',
    BOTID : 'botId',
    CONVESATIONID : 'conversationId',
    RUN : 'RUN',
    AGENTASSIST_RUN : 'Run with Agent Inputs',
    SEND : 'Send',
    COPY : 'Copy',
    COPIED : 'COPIED',
    SHOW_MORE : 'Show more',
    SHOW_LESS : 'Show less',
    READ_MORE : 'Read more',
    READ_LESS : 'Read less',
    EXPAND : 'Expand',
    READ_MORE_EXPAND : 'Read more | Expand',
    CLOSE : 'Close',
    DIALOG : 'Dialog task',
    FAQ : 'FAQ',
    ARTICLE : 'Article',
    SNIPPET : 'Snippet',
    VIEW_ALL_FAQ : 'View All FAQs',
    VIEW_FEW_FAQ : 'View Few FAQs',
    VIEW_ALL_ARTICLES : 'View All Articles',
    VIEW_FEW_ARTICLES : 'View Few Articles',
    VIEW_ALL_SNIPPETS : 'View All Snippets',
    VIEW_FEW_SNIPPETS : 'View Few Snippets',
    AGENT_SEARCH : 'Agent Search',
    LIBRARY_SEARCH : 'Library Search',
    ENTER_DETAILS : 'EnterDetails',
    DISCARD_ALL : 'discard all',
    TERMINATE : 'Terminate',
    INTERRUPT : 'Interrupt',
    LISTVIEW : 'ListView',
    RESTORE : 'Restore',
    RESTART : 'Restart',
    SUMMARY : 'Summary',
    INTENT : 'IntentName',
    HISTORY: 'History',
    STARTOVER : 'STARTOVER',
    RESTART_INPUTS : 'CAPTURED_INPUTS',
    PS_Y_REACH_START : 'ps-y-reach-start',
    PS_Y_REACH_END : 'ps-y-reach-end',
    PS_SCROLL_UP : 'ps-scroll-up',
    PROACTIVE_INITIAL_MODE : 'proactive_initial_mode',
    SMARTASSIST_SOURCE : 'smartassist-color-scheme',
    INCOMING : 'incoming',
    OUTGOING : 'outgoing',
    ASK_CUSTOMER : 'Ask Customer',
    TELL_CUSTOMER : 'Tell Customer',
    WELCOME_MSG : 'Welcome Message',
    YES : 'yes',
    NO : 'no',
    SENDMSG : 'agentAssist.SendMessage',
    COPYMSG : 'agentAssist.CopyMessage',
    SEND_METHOD : 'send',
    COPY_METHOD : 'copy',
    AWAITING : 'Awaiting Response  |  Type to override',
    OVERRIDE : 'Type to override',
    ACCEPT_RESPONSE : 'Response Accepted',
    AGENT_ENTERED : 'Agent Entered',
    WIDGET_LOADER : 'widget',
    INDIVIDUAL_LOADER : 'individual',
    LOGO_PATH : 'assets/images/logo/koreLogo.svg',
    DOCUMENTATION_LINK : 'https://docs.kore.ai/agentassist/',
    FAQ_LINK : 'https://docs.kore.ai/agentassist/frequently-asked-questions/faq/',
    KOREACADEMY_LINK : 'https://academy.kore.ai/',
    WRONG_SUGGESTION : "Wrong suggestions",
    INCORRECT_INTENT : "Incorrect intent",
    ACCIDENTAL_CLICK : "Accidental click",
    TIME_TAKING : "Time taking",
    OTHER : "Other",
    SETTINGS_DOCUMENTATION : "documentation",
    SETTINGS_FAQ : "faq",
    SETTINGS_KOREACADEMY : "koreAcademy",
    SUGGESTION_LINEHEIGHT : 18,
    SUGGESTION_ADDHEIGHT : 10,
    SUGGESTION_MAXHEIGHT : 12,
    jToken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjUzODYxNzgyMjMsImV4cCI6MTY2NTM4NjE3OTEyMywiYXVkIjoiIiwiaXNzIjoiY3MtZTRhMmI0YjYtM2RiZC01NWQwLWIwMjUtNDY2ZTVkMDRjOTgxIiwic3ViIjoiYy00NzJhNjYyLTQ5ZDYtNDM5Ny1hMjY1LTViNzE4ZDQ0MWNiNCIsImlzQW5vbnltb3VzIjpmYWxzZX0.1SN5BIEaQ4Rr6XpyKXR1AerNcIEmyDcnK6P0cpPkQzM"
}

export const supportLanguage = {
    AWAITING : "AWAITING",
    OVERRIDE : "OVERRIDE",
    COPY : "COPY",
    COPIED : "COPIED"
}

export const storageConst = {
    CURRENT_TAB : 'currentTab',
    AGENT_ASSIST_STATE : 'agentAssistState',
    IS_WELCOMEMSG_PROCESSED : 'isWelcomeProcessed',
    INITIALTASK_GOING_ON : 'initialTaskGoingOn',
    AUTOMATION_GOING_ON_AFTER_REFRESH : 'automationGoingOnAfterRefresh',
    AUTOMATION_GOING_ON_AFTER_REFRESH_MYBOT : 'automationGoingOnAfterRefreshMyBot',
    FAQ_LIST : 'faqList',
    INTERRUPT_DIALOG_LIST : 'interruptList',
    MYBOT_INTERRUPT_DIALOG_LIST : 'mybotInterruptList',
    SEARCH_VALUE : 'search',
    PROACTIVE_MODE : 'proactiveMode',
    LANGUAGE : 'lang',
    THEME : 'theme',
    ENGLISH : 'en',
    AUTO : 'auto',
    ACTIVE_TAB : 'activeTab',
    SHOWSEND : 'showSend',
    ENABLEWIDGET :   'enableWidget',
    ISSEND_WELCOME_MSG : 'isSendWelcomeMessage'
}

export const WidgetConst = {
    assist : ProjConstants.ASSIST,
    library : ProjConstants.SEARCH,
    transcript : ProjConstants.TRANSCRIPT,
    mybot : ProjConstants.MYBOT
}

export const languages = {
    en: 'English',
    ar: 'Arabic',
    ja: 'Japanese',
    chi: 'Chinese',
    fr: 'French'
}


export const RenderResponseType = {
    SUGGESTIONS : 'SUGGESTIONS',
    SMALLTALK : 'SMALLTALK',
    AUTOMATION : 'AUTOMATION',
    USERMSG : 'USERMSG',
    ASSISTRESPONSE : 'ASSISTRESPONSE',
    FEEDBACK : 'FEEDBACK',
    WELCOME_MSG : 'WELCOME_MSG'
}

export const FeebackConst = {
    LIKE : 'like',
    DISLIKE : 'dislike',
    DISLIKE_LIST : ['Wrong suggestions', 'Incorrect intent', 'Accidental click', 'Time taking', 'Other']
}

export const coachingConst = {
    NUDGE_DATA: {
        positive: {
            color: '#22C55E',
            icon: 'krIocnsFont-thumbs-up'
        },
        neutral: {
            color: '#E5E5E5',
            className : 'info-nudge'
        },
        alert: {
            color: '#F59E0B',
            icon: 'krIocnsFont-alert-triangle',
            className : 'warning-nudge'
        },
        critical: {
            color: '#EF4444',
            icon: 'krIocnsFont-hand',
            className : 'danger-nudge'
        }
    },

    HINT_DATA: {
        positive: {
            color: '#22C55E',
            icon: 'krIocnsFont-thumbs-up'
        },
        neutral: {
            color: '#E5E5E5',
            icon : 'krIocnsFont-exclamation',
            className : 'info-hint'
        },
        alert: {
            color: '#F59E0B',
            icon : 'krIocnsFont-alert-triangle',
            className: 'warning-hint',
        },
        critical: {
            color: '#EF4444',
            icon : 'krIocnsFont-hand',
            className: 'danger-hint'
        }
    },
    SENTIMENT_ANALYSIS : {
        negative : {
            color : "#EF4444",
            title : "Negative",
            percentage : "20%"
        },
        neutral : {
            color : "#FBBF24",
            title : "Neutral",
            percentage : "40%"
        },
        positive : {
            color : "#47B39C",
            title : "Positive",
            percentage : "40%"
        },
    },
    SENTI_CHART_YAXIS_LIST : {
        [-2] : '-Neg',
        0 : 'Neu',
        2 : '+Pos'
    },
    SENTI_POLARITY_MAP : {
        1 : -2,
        2 : -1,
        3 : -1,
        4 : 0,
        5 : 0,
        6 : 0,
        7 : 1,
        8 : 1,
        9 : 2,
        10 : 2
    },
    POLARITY_VS_STYLES : {
        'Positive' : {
            className : 'positive-title',
            icon : 'ast-thumbup',
            emoji : '&#x1F604;'
        },
        'Neutral' : {
            className : 'neutral-title',
            icon : 'ast-thumbup',
            emoji : '&#x1F610;'
        },
        'Negative' : {
            className : 'negative-title',
            icon : 'ast-thumbdown',
            emoji : '&#x1F641;'
        }
    }
}
