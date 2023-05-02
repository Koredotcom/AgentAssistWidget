export interface userAgInputMessages {
    "author"?: {
      "id": string,
      "firstName": string,
      "email": string,
      "lastName": string,
      "profImage": string //url
    },
    "botId"?: string,
    "from": string, //AGENT (or) USER
    "sessionId"?: string,
    "conversationId"?: string,
    "timestamp"?: string,
    "message": "", // user or agent sent message
    "isTemplate"?: boolean,
    "isAttachement"?: boolean,
    "attachmentDetails"?: [{
      "fileName": string,
      "fileUrl": string,
      "fileType": string
    }],
    "templatePayload"?: [],
    "sentType"?: string // send (or) copy
}
