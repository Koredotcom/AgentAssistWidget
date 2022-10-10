export enum EVENTS {
    'event' = 'event',
    'request_port' = 'request_port',
    'control_message' = 'control_message',
    'connect' = 'connect',
    'disconnect' = 'disconnect',
    'error' = 'error',
    'connect_error' = 'connect_error',
    'conversation_closed' = 'conversation_closed',
    'welcome_message_request' = 'welcome_message_request',
    'user_message' = 'user_message',
    'agent_message'  = 'agent_message',
    'agent_assist_request' = 'agent_assist_request',
    'agent_assist_response' = 'agent_assist_response',
    'agent_menu_request' = 'agent_menu_request',
    'agent_menu_response' = 'agent_menu_response',
    'agent_assist_user_message' = 'agent_assist_user_message',
    'agent_feedback_request' = 'agent_feedback_request',
    'agent_feedback_response' = 'agent_feedback_response',
    'agent_usage_feedback' = 'agent_usage_feedback',
    'agent_assist_agent_request' = 'agent_assist_agent_request',
    'agent_assist_agent_response' = 'agent_assist_agent_response',
    'agent_assist_endoftask' = 'agent_assist_endoftask',
    'response_resolution_comments' = 'response_resolution_comments'
}