import { ChatOffWorking } from "./agent-defaults.model";

export const EMPTY_CHAT_OFF_WORKING: ChatOffWorking = {
    experience: "CHAT",
    type: "OFF_WORKING_HOURS",
    orgId: "",
    createdBy: "",
    createdAt: "",
    updatedAt: "",
    id: "",
    liveChatConfig: {
        message: {
            locale: [
                {
                    language: "en",
                    message: "You have reached us off hours and no one is available to attend you right now. Our hours of operation are Monday to Friday, from 9am to 5pm EST. Please do reach out us back during that timeframe.",
                    isActive: true
                }
            ]
        },
        afterMessage: "END_CHAT"
    },
    messagingConfig: {
        message: {
            locale: [
                {
                    language: "en",
                    message: "You have reached us off hours and no one is available to attend you right now. Our hours of operation are Monday to Friday, from 9am to 5pm EST. Please do reach out us back during that timeframe.",
                    isActive: true
                }
            ]
        },
        afterMessage: "END_CHAT",
        emailId: ""
    }
}