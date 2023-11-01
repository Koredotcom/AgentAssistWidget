export interface userAgInputMessages {
    "author"?: {
      "id": string,
      "firstName": string,
      "email": string,
      "lastName": string,
      "profImage": string, //url
      "type": string //AGENT (or) USER
    },
    "wordLevelTimeStamps"?: {
      "conversationId"?: string,
      "transcripts":any
    },
    "botId"?: string,
    "type": string, //AGENT (or) USER
    "sessionId"?: string,
    "conversationId"?: string,
    "timestamp"?: string,
    "accountId"?: string,
    "orgId"?: string,
    "userId"?: string,
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
