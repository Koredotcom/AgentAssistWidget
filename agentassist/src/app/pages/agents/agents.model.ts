
export class Agent {
    firstName: string;
    lastName: string;
    nickName?: string;
    phoneNumber: number;
    emailId: string;
    profImage?: any;
    agentGroupId: any;
    hoursOfOperationId: any;
    oldRoleId: string;
    roleId: string;
    agentAffinity: boolean = true;
    canSupportChat: boolean = true;
    maxChatSupport: number = 5;
    chatLanguageSupport:  {
        language?: string,
        proficiency?: string
      }[];
    canSupportVoice: boolean = true;
    voiceLanguageSupport: {
        language?: string,
        proficiency?: string
      }[];
    skills:  {
      skillId?: string,
      proficency?: string
    }[]
  
}