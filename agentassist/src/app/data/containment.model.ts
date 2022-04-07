export interface IContainmentStats {
    agentTransfer: StatsCount;
    dropoff: StatsCount;
    selfService: StatsCount;
    total: StatsCount;
}

interface StatsCount {
    count: number,
    percentage: number,
    progress?: number
}


      // const data: IContainmentStats = {
      //   agentTransfer: { count: 350, percentage: 12 },
      //   selfService: { count: 800, percentage: 12 },
      //   dropoff: { count: 50, percentage: -12 },
      //   total: { count: 1200, percentage: 12 }
      // }

     // this.conversations = [
      //   {
      //     "date": new Date('08/01/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 100,
      //     "noOfDropOffSessions": 100,
      //     "noOfAgentTransferSessions": 100
      //   },
      //   {
      //     "date": new Date('08/02/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 200,
      //     "noOfDropOffSessions": 200,
      //     "noOfAgentTransferSessions": 250
      //   },
      //   {
      //     "date": new Date('08/03/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 200,
      //     "noOfDropOffSessions": 200,
      //     "noOfAgentTransferSessions": 200
      //   },
      //   {
      //     "date": new Date('08/04/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 334,
      //     "noOfDropOffSessions": 334,
      //     "noOfAgentTransferSessions": 334
      //   },
      //   {
      //     "date": new Date('08/05/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 390,
      //     "noOfDropOffSessions": 390,
      //     "noOfAgentTransferSessions": 390
      //   },
      //   {
      //     "date": new Date('08/06/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 330,
      //     "noOfDropOffSessions": 330,
      //     "noOfAgentTransferSessions": 330
      //   },
      //   {
      //     "date": new Date('08/07/2020').toISOString(),
      //     "totalConversations": 10,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 220,
      //     "noOfDropOffSessions": 220,
      //     "noOfAgentTransferSessions": 220
      //   }
      // ]

      // this.selfServiceConversations = [
      //   {
      //     "date": new Date('08/01/2020').toISOString(),
      //     "totalConversations": 39,
      //     "noOfSessionsWithErrors": 14,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 100,
      //     "noOfDropOffSessions": 100,
      //     "noOfAgentTransferSessions": 100,
      //     "noOfSessionsInVoice": 18,
      //     "noOfSessionsInChat": 9
      //   },
      //   {
      //     "date": new Date('08/02/2020').toISOString(),
      //     "totalConversations": 45,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 200,
      //     "noOfDropOffSessions": 200,
      //     "noOfAgentTransferSessions": 250,
      //     "noOfSessionsInVoice": 30,
      //     "noOfSessionsInChat": 28
      //   },
      //   {
      //     "date": new Date('08/03/2020').toISOString(),
      //     "totalConversations": 32,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 200,
      //     "noOfDropOffSessions": 200,
      //     "noOfAgentTransferSessions": 200,
      //     "noOfSessionsInVoice": 10,
      //     "noOfSessionsInChat": 22
      //   },
      //   {
      //     "date": new Date('08/04/2020').toISOString(),
      //     "totalConversations": 48,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 334,
      //     "noOfDropOffSessions": 334,
      //     "noOfAgentTransferSessions": 334,
      //     "noOfSessionsInVoice": 35,
      //     "noOfSessionsInChat": 32
      //   },
      //   {
      //     "date": new Date('08/05/2020').toISOString(),
      //     "totalConversations": 31,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 390,
      //     "noOfDropOffSessions": 390,
      //     "noOfAgentTransferSessions": 390,
      //     "noOfSessionsInVoice": 15,
      //     "noOfSessionsInChat": 11
      //   },
      //   {
      //     "date": new Date('08/06/2020').toISOString(),
      //     "totalConversations": 23,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 330,
      //     "noOfDropOffSessions": 330,
      //     "noOfAgentTransferSessions": 330,
      //     "noOfSessionsInVoice": 25,
      //     "noOfSessionsInChat": 13
      //   },
      //   {
      //     "date": new Date('08/07/2020').toISOString(),
      //     "totalConversations": 35,
      //     "noOfSessionsWithErrors": 2,
      //     "noOfSessionsWithoutErrors": 2,
      //     "noOfSelfServiceSessions": 220,
      //     "noOfDropOffSessions": 220,
      //     "noOfAgentTransferSessions": 220,
      //     "noOfSessionsInVoice": 16,
      //     "noOfSessionsInChat": 28
      //   }
      // ]

      // const x = {
      //   "analysisCounts": {
      //     "duration": [
      //       { voiceCount: 20, chatCount: 10, span: "<10" },
      //       { voiceCount: 30, chatCount: 15, span: "10-60" },
      //       { voiceCount: 40, chatCount: 15, span: "60<" }],
      //     "messages": [
      //       { voiceCount: 30, chatCount: 15, span: "1-5" },
      //       { voiceCount: 30, chatCount: 15, span: "6-20" },
      //       { voiceCount: 30, chatCount: 15, span: "20<" }],
      //     "tasks": [
      //       { voiceCount: 30, chatCount: 15, span: "0-5" },
      //       { voiceCount: 30, chatCount: 15, span: "6-10" },
      //       { voiceCount: 40, chatCount: 15, span: "10<" }]
      //   }
      // };


       // const x = {
      //   result: [
      //     {
      //       flow: [{ "name": "book ticket", "mode": "voice" }, { "name": "check weather", "mode": "voice" }],
      //       dialogFlow: [
      //         {
      //           taskId: "xxxx",
      //           taskType: "dialog",
      //           result: "success"
      //         }
      //       ],
      //       count: 3
      //     },
      //     {
      //       flow: [{ "name": "book ticket", "mode": "voice" }, { "name": "check weather", "mode": "chat" }],
      //       dialogFlow: [
      //         {
      //           taskId: "xxxx",
      //           taskType: "dialog",
      //           result: "failure"
      //         }
      //       ],
      //       count: 2
      //     }
      //   ],
      //   tasks: [
      //     {
      //       _id: "dg-xxx",
      //       localeData: {
      //         "en": { "name": "dialog 1" }
      //       }
      //     }
      //   ]

      // }