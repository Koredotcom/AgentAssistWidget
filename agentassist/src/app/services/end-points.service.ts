import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';
@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  private API_URL_PREFIX = "/api";
  private API_VERSION_PREFIX = '/1.1';
  private SERVER_URL: String;
  private API_SERVER_URL: String;
  private SUPPORT_API_SERVER_URL: String;

  private serviceList: Object = {};

  constructor() {
    // if (environment.production) {
    //   this.SERVER_URL = window.location.protocol + '//' + window.location.host;
    //   this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    // } 
    
    this.SERVER_URL = environment['API_SERVER_URL'];
    this.API_SERVER_URL = environment['API_SERVER_URL'] + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    this.SUPPORT_API_SERVER_URL = environment['SUPPORT_API_SERVER_URL'] + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    this.init();
  }

  public getServiceInfo(serviceId): any {
    return this.serviceList[serviceId] || {};
  }
  public init() {
    this.serviceList['sales.signout'] = {
      endpoint: this.API_SERVER_URL + '/oAuth/signout',
      method: 'delete'
    };

    this.serviceList['refreshToken'] = {
      endpoint: this.API_SERVER_URL + '/oauth/token',
      method: 'post'
    };

    this.serviceList['post.tokenDetails'] = {
      endpoint: this.API_SERVER_URL + '/sso/login',
      method: 'post'
    };

    this.serviceList['app.controls'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/AppControlList?includeAgentDesktopPermissions=true',
      method: 'get'
    };

    // this.serviceList['get.deflect.apps'] = {
    //   endpoint: this.API_SERVER_URL + '/deflectai/apps',
    //   method: 'get'
    // };

    // this.serviceList['save.deflect.apps'] = {
    //   endpoint: this.API_SERVER_URL + '/deflectai/apps',
    //   method: 'post'
    // };

    this.serviceList['get.callflow.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/messages',
      method: 'get'
    };

    this.serviceList['save.callflow.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/messages',
      method: 'put'
    };

    this.serviceList['put.updateFormFields'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/formfields',
      method: 'put'
    };

    this.serviceList['get.getFormFields'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/formfields',
      method: 'get'
    };

    this.serviceList['get.summary'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/summary',
      method: 'get'
    };

    this.serviceList['get.plans'] = {
      endpoint: this.API_SERVER_URL + '/organization/billing/plans',
      method: 'get'
    };

    this.serviceList['post.payProCheckout'] = {
      endpoint: this.API_SERVER_URL + '/organization/billing/plans/:productId/checkout',
      method: 'post'
    };


    this.serviceList['get.payProStatus'] = {
      endpoint: this.API_SERVER_URL + '/organization/billing/payments/:reqId/status',
      method: 'get'
    };


    this.serviceList['post.publish'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/publish',
      method: 'post'
    }

    this.serviceList['post.deploy.publish'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/deployments/publish?isAgentAssist=true',
      method: 'post'
    }

    this.serviceList['get.deploy.status'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/status',
      method: 'get'
    }

    this.serviceList['get.ivrConfiguration.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/voicesettings',
      method: 'get'
    };

    this.serviceList['save.ivrConfiguration.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/voicesettings',
      method: 'put'
    };

    this.serviceList['deflect.seed.data'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/seed_data',
      method: 'get'
    };

    this.serviceList['enable.ivr.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/enableConfiguration',
      method: 'post'
    };

    this.serviceList['real.time.dashboardData'] = {
      endpoint: this.API_SERVER_URL + '/builder/metrics/usage/user/:userId/org/:orgId/stream/:streamId/rta/stats?isDeflect=true&metrics=inProgressSessions,automation,digitalFormInput,nAgentSessions',
      method: 'get'
    };

    this.serviceList['get.journey.flow'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/metrics/journeyFlow?startDate=:startDate&endDate=:endDate',
      method: 'get'
    };

    this.serviceList['get.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/configuration',
      method: 'get'
    };

    this.serviceList['post.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/configuration',
      method: 'post'
    };

    this.serviceList['get.agent.instructions'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/agents/:agentKey/instructions',
      method: 'get'
    };

    this.serviceList['get.sdk.apps'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:appId/sdk/apps',
      method: 'get'
    };

    this.serviceList['post.callLogs.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/callLogs',
      method: 'post'
    };

    this.serviceList['get.callLogs.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/callLogs',
      method: 'get'
    };

    this.serviceList['post.converLogs.export'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/callLogs/export',
      method: 'post'
    };

    this.serviceList['get.callflow.chatHistory'] = {
      endpoint: this.API_SERVER_URL + '/botmessages?botId=:streamId&msgId=:msgId&limit=200&dateFrom=:dateFrom&dateTo=:dateTo',
      method: 'get'
    };
    this.serviceList['get.changeLogs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/bt/:streamId/getbtlogs',
      method: 'get'
    };
    this.serviceList['get.token'] = {
      endpoint: this.API_SERVER_URL + '/sso/token',
      method: 'get'
    };
    this.serviceList['get.availableNumbers'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/availableNumbers',
      method: 'get'
    };

    /** FAQ section start */
    this.serviceList['get.knowledgetasks'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgetasks?streamId=:streamId',
      method: 'get'
    };

    this.serviceList['create.knowledgetask'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgetasks',
      method: 'post'
    };

    this.serviceList['get.fags'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs?ktId=:ktId',
      method: 'get'
    };

    this.serviceList['get.getorsearchfaq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs?ktId=:ktId&limit=:limit&offset=:offSet&search=:searchParam&parentId=:parentId&withallchild=:withallchild&type=:filter',
      method: 'get'
    };

    this.serviceList['create.faqs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs',
      method: 'post'
    };

    this.serviceList['edit.faq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/:faqID',
      method: 'put'
    };

    this.serviceList['delete.faq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/:faqID',
      method: 'delete'
    };

    this.serviceList['get.possibletags'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/possibletags?ktId=:ktId',
      method: 'post'
    };

    this.serviceList['get.globalsynonyms'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/builder/globalsynonyms?offset=:offset&limit=:limit&search=:search&keyword=:keyword&state=:state&ktId=:ktId',
      method: 'get'
    };

    this.serviceList['post.uploadfaqfile'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/file',
      method: 'post'
    };

    this.serviceList['post.importfaqfile'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/import',
      method: 'post'
    };

    this.serviceList['get.faqstatus'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/status?callName=:callName',
      method: 'get'
    };

    this.serviceList['post.faqexport'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/export',
      method: 'post'
    };

    this.serviceList['get.faqmetrics'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/metrics?ktId=:ktId&streamId=:streamId',
      method: 'get'
    };

    this.serviceList['train.faqs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgeTasks/faq/train?streamId=:streamId&ktId=:ktId',
      method: 'post'
    };

    /** FAQ Section End **/

    // Personalization section start

    this.serviceList['storyboard.getSceneConversation'] = {
      // tslint:disable-next-line: max-line-length
      // endpoint: this.API_SERVER_URL + this.API_VERSION_PREFIX + '/builder/streams/:streamId/scenes/:sceneId/conversation?allComponents=:allComponents',
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/scenes/:sceneId/',
      method: 'get'
    };

    this.serviceList['storyboard.editWidget'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/scenes/widgets',
      method: 'put'
    };

    this.serviceList['storyboard.editScene'] = {
      // tslint:disable-next-line: max-line-length
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/scenes/:sceneId/',
      method: 'put'
    };

    this.serviceList['storyboard.getWidgets'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/scenes/widgets',
      method: 'get'
    };


    /** DOCK STATUS START **/

    this.serviceList['get.dockstatus'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dockStatus',
      method: 'get'
    };

    this.serviceList['put.updatedockstatus'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dockStatus/:dsId',
      method: 'put'
    };
    
    this.serviceList['get.dockstatus.callflow.versions'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/dockStatus',
      method: 'get'
    };

    this.serviceList['put.updatedockstatus.callflow.versions'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/dockStatus/:dsId',
      method: 'put'
    };

    this.serviceList['delete.dockstatus'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dockStatus/:dsId',
      method: 'delete'
    };

    this.serviceList['deleteAll.dockstatus'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dockStatus',
      method: 'delete'
    };

    this.serviceList['get.downloaddockfile'] = {
      endpoint: this.API_SERVER_URL + '/attachment/file/:fileId/url',
      method: 'get'
    };

    /** DOCK STATUS END **/


    this.serviceList['get.agentChatHistory'] = {
      endpoint: this.API_SERVER_URL + "/botmessages/chathistorytoagent?botId=:botId",
      method: 'get'
    };

    this.serviceList['post.previewVoice'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:streamId/previewVoice',
      method: 'post'
    };


    //APIs for Usecases START

    this.serviceList['get.usecases'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases?limit=:limit&offset=:offset&search=:search&filterby=:filterby&usecaseType=:usecaseType&status=:status',
      method: 'get'
    };

    this.serviceList['post.createCategory'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases/category',
      method: 'post'
    };

    this.serviceList['get.categories'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases/category',
      method: 'get'
    };

    this.serviceList['post.createUsecase'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases',
      method: 'post'
    };

    this.serviceList['post.deleteUsecase'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases/:usecaseId',
      method: 'delete'
    };

    this.serviceList['post.editUsecase'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/usecases/:usecaseId',
      method: 'put'
    };

    //APIs for Usecases END

    /** Default Messages START */
    this.serviceList['get.default.messages'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/messages',
      method: 'get'
    };

    this.serviceList['save.default.messages'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/messages',
      method: 'post'
    };
    /**Default Messages END */

    /** SETTINGS API START **/

    this.serviceList['get.incoming'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/incoming',
      method: 'get'
    };

    this.serviceList['post.incoming'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/incoming',
      method: 'post'
    };

    this.serviceList['post.configure.address'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/phonenumbers/customeraddress',
      method: 'post'
    };

    this.serviceList['get.bot.address'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/address',
      method: 'get'
    };

    this.serviceList['get.phonenumber.countries'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/phonenumbers/countries',
      method: 'get'
    };

    this.serviceList['get.country.phonenumbers'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/phonenumbers/availablenumbers',
      method: 'get'
    };

    this.serviceList['remove.phonenumber'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/incoming',
      method: 'delete'
    };

    this.serviceList['get.settings.voicePreferences'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/voicePreferences',
      method: 'get'
    };

    this.serviceList['post.settings.voicePreferences'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/voicePreferences',
      method: 'post'
    };

    this.serviceList['get.settings.outgoing'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/outgoing',
      method: 'get'
    };

    this.serviceList['post.settings.outgoing'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/deployments/outgoing',
      method: 'post'
    };

    this.serviceList['get.settings.webhook'] = {
      endpoint: this.API_SERVER_URL + '/agentsdk/webhook/:agentName/stream/:streamId',
      method: 'get'
    };

    this.serviceList['get.settings.widget'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/widget',
      method: 'get'
    };

    this.serviceList['get.settings.widgets'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/widgets',
      method: 'get'
    };

    this.serviceList['post.settings.widget'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/widget',
      method: 'post'
    };

    this.serviceList['get.settings.embedwebsdk'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/embedwebsdk',
      method: 'get'
    };

    this.serviceList['post.settings.embedwebsdk'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/settings/embedwebsdk',
      method: 'post'
    };

    /** SETTINGS API END **/


    /** TESTING APIs START */
    this.serviceList['post.sts.support'] = {
      endpoint: this.SUPPORT_API_SERVER_URL + '/users/sts',
      method: 'post'
    };

    this.serviceList['post.sts'] = {
      endpoint: this.API_SERVER_URL + '/users/sts',
      method: 'post'
    };

    this.serviceList['post.jwtgrant'] = {
      endpoint: this.API_SERVER_URL + '/oAuth/token/jwtgrant',
      method: 'post'
    };

    this.serviceList['get.trainStatus'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/trainStatus',
      method: 'get'
    };

    /**TESTING APIS END */


    /** ONBOARDING START **/
    this.serviceList['get.existingbots'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/automationbots/existingbots',
      method: 'get'
    };

    this.serviceList['post.convertbot'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/automationbots/convertbot?isAgentAssist=true',
      method: 'post'
    };

    this.serviceList['get.addBot'] = {
      endpoint: this.API_SERVER_URL + '/builder/samplebots/:streamId/add',
      method: 'get'
    }

    this.serviceList['post.importbot'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/importBot?isAgentAssist=true',
      method: 'post'
    };

    this.serviceList['get.importbotstatus'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/importBot/status/:importId',
      method: 'get'
    };

    this.serviceList['get.importconvertbotstatus'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/importBot/status/:importId?isLinkedSmartAssist=true',
      method: 'get'
    };


    this.serviceList['post.importbot.overrideFull'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/importBot/:streamId?fullImport=:fullImport',
      method: 'post'
    };

    this.serviceList['post.importbot.overrideIncrement'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/importBot/:streamId?incrementalImport=:incrementalImport',
      method: 'post'
    };

    this.serviceList['post.importbot.export'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/export',
      method: 'post'
    };

    this.serviceList['get.importbot.exportStatus'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/export/status',
      method: 'get'
    };

    this.serviceList['get.importbot.exportUrl'] = {
      endpoint: this.API_SERVER_URL + '/attachment/file/:fileId/url',
      method: 'get'
    };

    /** ONBOARDING END **/


    /** LIVEBOARD START **/

    this.serviceList['get.liveboard.stats'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/liveboard/stats',
      method: 'get'
    }

    this.serviceList['get.liveboard.hourlystats'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/liveboard/hourlystats?startDate=:startDate&endDate=:endDate',
      method: 'get'
    }

    this.serviceList['get.liveboard.popularuc'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/liveboard/popularusecases',
      method: 'get'
    }

    this.serviceList['get.liveboard.automationsavings'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/liveboard/automationsavings',
      method: 'get'
    }


    /** LIVEBOARD END **/

    /** INVITE DEVELOPERS START */
    this.serviceList['get.bt.stream'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId',
      method: 'get'
    }

    this.serviceList['get.bt.variables'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/stream/:streamId/variables',
      method: 'get'
    }

    this.serviceList['put.bt.variables'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/stream/:streamId/variables',
      method: 'put'
    }

    this.serviceList['get.share.email'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/sharebot/getmanagedusers/organizations/:orgId',
      method: 'get'
    }

    this.serviceList['get.bt.roles'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/sharebot/getorgroles/organizations/:orgId',
      method: 'get'
    }

    this.serviceList['get.shared.developers'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/getcodevelopers',
      method: 'get'
    }

    this.serviceList['put.sharebot'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/sharebot',
      method: 'put'
    }

    this.serviceList['post.invite.user'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/inviteUser',
      method: 'post'
    }

    /** INVITE DEVELOPERS END */

    /** Analytics Start */

    this.serviceList['analytics.containmentmetrics'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/containmentmetrics',
      method: 'get'
    }

    this.serviceList['analytics.totalinteractions'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/totalinteractions',
      method: 'get'
    }

    this.serviceList['analytics.taskcompletionrate'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/completedtaskrate',
      method: 'get'
    }

    this.serviceList['analytics.intentidentificationrate'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/intentidentificationrate',
      method: 'get'
    }

    this.serviceList['analytics.deflectionrate'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/deflectionrate',
      method: 'get'
    }

    this.serviceList['analytics.taskanalysis'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/taskanalysis',
      method: 'get'
    }

    this.serviceList['analytics.unidentifiedutterances'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/unidentifiedutterances',
      method: 'get'
    }

    this.serviceList['analytics.poplarautomatedusecases'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/poplarautomatedusecases',
      method: 'get'
    }

    this.serviceList['analytics.automationsavings'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/automationsavings',
      method: 'get'
    }

    this.serviceList['analytics.dropoffduration'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/dropoffduration',
      method: 'get'
    }

    this.serviceList['analytics.dropoffmessageexchange'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/dropoffmessageexchange',
      method: 'get'
    }

    this.serviceList['analytics.dropoffpriorconversations'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/dropoffpriorconversations',
      method: 'get'
    }

    this.serviceList['analytics.dropoffpriorunidentifiedutterances'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/dropoffpriorunidentifiedutterances',
      method: 'get'
    }

    this.serviceList['analytics.agenttransferswithduration'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/agenttransferswithduration',
      method: 'get'
    }

    this.serviceList['analytics.agenttransferswithmessageexchange'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/agenttransferswithmessageexchange',
      method: 'get'
    }

    this.serviceList['analytics.agenttransferpriorconversations'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/agenttransferpriorconversations',
      method: 'get'
    }

    this.serviceList['analytics.agenttransferprioruautomationsavingsnidentifiedutterances'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/agenttransferprioruautomationsavingsnidentifiedutterances',
      method: 'get'
    }

    this.serviceList['analytics.userinteractions'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/userinteractions',
      method: 'get'
    }

    this.serviceList['analytics.uservolume'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/uservolume',
      method: 'get'
    }

    this.serviceList['analytics.totalautomatedusecases'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/totalautomatedusecases',
      method: 'get'
    }

    this.serviceList['analytics.dropoffs'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/dropOffs',
      method: 'get'
    }

    this.serviceList['analytics.agenttransfers'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/agentTransfers',
      method: 'get'
    }

    this.serviceList['analytics.callFlowMetrics'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:appId/analytics/callFlowMetrics?startDate=:startDate&endData=:endDate',
      method: 'get'
    }

    /**ANalytics End */


    /** CONVERSATION LOGS NEW START */
    this.serviceList['post.flow.events'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:streamId/CDRConversationalFlow',
      method: 'post'
    };

    this.serviceList['post.flow.usecases'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:streamId/CDRIntentIdentified',
      method: 'post'
    };

    this.serviceList['get.flow.types'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:streamId/CDRIntentIdentified',
      method: 'get'
    };

    /** CONVERSATION LOGS NEW END */


    /** BILLINGS USAGE START */

    this.serviceList['get.billing.balance'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/billing/availableBalance',
      method: 'get'
    }

    this.serviceList['get.billing.autorecharge'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/billing/autoRecharge',
      method: 'get'
    }

    this.serviceList['post.billing.autorecharge'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/billing/autoRecharge',
      method: 'post'
    }

    this.serviceList['get.billing.checkout'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/billing/checkout?amount=:amount',
      method: 'get'
    }

    this.serviceList['get.billing.invoices'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/billing/invoices?limit=:limit&skip=:skip&search=:search',
      method: 'get'
    }

    /** BILLINGS USAGE END */

    this.serviceList['train.dialogs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/sentences/ml/train?streamId=:streamId',
      method: 'post'
    }


    /** SKILLS API START  **/

    this.serviceList['get.allSkills'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/skills?limit=:limit',
      method: 'get'
    }

    this.serviceList['post.skillsGp'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup',
      method: 'post'
    }

    this.serviceList['get.skillsGp'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup?name=:name&limit=:limit&skip=:skip&minPoints=:minPoints',
      method: 'get'
    }

    this.serviceList['get.skillsGp.id'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:id',
      method: 'get'
    }

    this.serviceList['put.skillsGp.update'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:id',
      method: 'put'
    }

    this.serviceList['get.skills'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:skillGpId/skill?name=:skillName&limit=:limit&skip=:skip&minPoints=:minPoints',
      method: 'get'
    }

    this.serviceList['get.skillGp.skill'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:skillGpId/skill/:skillId?name=:name&limit=50&skip=0&minPoints=0',
      method: 'get'
    }

    this.serviceList['post.skill'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:id/skill',
      method: 'post'
    }

    this.serviceList['put.skill'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:id/skill/:skillId',
      method: 'put'
    }

    this.serviceList['delete.skillsGp'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:id',
      method: 'delete'
    }

    this.serviceList['delete.skill'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/skillgroup/:gpId/skill/:skillId',
      method: 'delete'
    }

    this.serviceList['get.skillsAgents'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/agents?limit=:limit&page=:page',
      method: 'get'
    }

    /** SKILLS API END  **/


    /** AGENTS APIs START */

    this.serviceList['get.agentsGp'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agentgroup?name=:name&sortBy=:sortBy&limit=:limit&page=:page',
      method: 'get'
    }

    this.serviceList['post.createNewAgentGroup'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agentgroup',
      method: 'post'
    };

    this.serviceList['put.agentsGp.update'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agentgroup/:id',
      method: 'put'
    }

    this.serviceList['delete.agentsGp'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agentgroup/:id',
      method: 'delete'
    }

    this.serviceList['post.createNewAgent'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents',
      method: 'post'
    };

    this.serviceList['get.agents.byGroup'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents?groupId=:groupId&sortBy=:sortBy&limit=:limit&page=:page',
      method: 'get'
    };

    this.serviceList['get.agent'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/:agentId?groupId=:groupId',
      method: 'get'
    };

    this.serviceList['put.agent'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/:agentId?groupId=:groupId',
      method: 'put'
    };

    this.serviceList['delete.agent'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/:agentId?groupId=:groupId',
      method: 'delete'
    };

    this.serviceList['get.agentGpManagers'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/agents?sortBy=:sortBy&role=:role&limit=:limit&page=:page',
      method: 'get'
    }

    this.serviceList['get.agentSkills'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/skills?limit=:limit&page=:page',
      method: 'get'
    }

    /** AGENTS API END  **/


    /** AGENT SETTINGS API START */

    this.serviceList['get.agentSettings.hoursOperations'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/operationhours?limit=:limit&page=:page',
      method: 'get'
    }

    this.serviceList['post.agentSettings.createHoursOperation'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/operationhours',
      method: 'post'
    }

    this.serviceList['put.agentSettings.putHoursOperation'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/operationhours/:id',
      method: 'put'
    }

    this.serviceList['get.hoursOperations'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/operationhours/:id',
      method: 'get'
    }

    this.serviceList['delete.hoursOperations'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/operationhours/:id',
      method: 'delete'
    }

    this.serviceList['get.queueSettings'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/queue-settings',
      method: 'get'
    }

    this.serviceList['put.queueSettings'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/organizations/:orgId/queue-settings',
      method: 'put'
    }

    this.serviceList['get.agentLangSettings'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/language',
      method: 'get'
    }

    this.serviceList['post.agentLangSettings'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/language',
      method: 'post'
    }

    this.serviceList['put.agentLangSettings'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/language/:languageId',
      method: 'put'
    }

    this.serviceList['get.agentSettings.status'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/status',
      method: 'get'
    }

    this.serviceList['put.agentLangSettings.status'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agents/settings/status/:id',
      method: 'put'
    }

    /** AGENT SETTINGS API END  **/


    // WAIT EXPERIENCE START

    this.serviceList['post.waitExp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/waiting-experiences",
      method: 'post'
    }

    this.serviceList['get.waitExp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/waiting-experiences?description=:description",
      method: 'get'
    }

    this.serviceList['get.waitExp.single'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/waiting-experiences/:id",
      method: 'get'
    }

    this.serviceList['put.waitExp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/waiting-experiences/:id",
      method: 'put'
    }

    this.serviceList['delete.waitExp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/waiting-experiences/:id",
      method: 'delete'
    }

    // WAIT EXPERIENCE END


    //  USER MANAGEMENT START

    this.serviceList['get.um.users'] = {
      endpoint: this.SERVER_URL + "/users?limit=:limit&page=:page",
      method: 'get'
    }

    //  USER MANAGEMENT END

    // ROLE MANAGEMENT START

    this.serviceList['get.rm.roles'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/roles",
      method: 'get'
    };

    this.serviceList['post.rm.roles'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/roles",
      method: 'post'
    };

    this.serviceList['put.rm.roles'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/roles/:id",
      method: 'put'
    };

    this.serviceList['delete.rm.roles'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/roles/:id",
      method: 'delete'
    };

    // ROLE MANAGEMENT END

    /** USER PROFILE START */
    this.serviceList['get.profile'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/profile',
      method: 'get'
    }

    this.serviceList['post.profile'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/profile',
      method: 'put'
    }
    /** USER PROFILE END */


    /** AGENT ASSIST API's START */
    this.serviceList['get.agentAssist.standardResp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups?limit=:limit&page=:page&name=:name&sortBy=:sortBy",
      method: 'get'
    }

    this.serviceList['get.agentAssist.standardRespGroupById'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:id",
      method: 'get'
    }

    this.serviceList['post.agentAssist.standardResp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups",
      method: 'post'
    }

    this.serviceList['put.agentAssist.standardResp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:id",
      method: 'put'
    }

    this.serviceList['delete.agentAssist.standardRespGp'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:id",
      method: 'delete'
    }

    this.serviceList['get.agentAssist.responses'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:groupId/standard-responses?limit=:limit&page=:page&name=:name&sortBy=:sortBy",
      method: 'get'
    }

    this.serviceList['post.agentAssist.responses'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:groupId/standard-responses",
      method: 'post'
    }

    this.serviceList['put.agentAssist.responses'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:groupId/standard-responses/:id",
      method: 'put'
    }

    this.serviceList['delete.agentAssist.response'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/standard-response-groups/:groupId/standard-responses/:id",
      method: 'delete'
    }

    /** AGENT ASSIST API's  END */

    this.serviceList['get.permissions'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/permissions",
      method: 'get'
    }

    /** EMAIL SUPPORT API'S START */

    this.serviceList['get.channel.emailsupport'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels?searchEmail=:searchEmail&type=:type&botId=:botId",
      method: 'get'
    }

    this.serviceList['post.channel.emailsupport'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels",
      method: 'post'
    }

    this.serviceList['put.channel.emailsupport'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels/:id",
      method: 'put'
    }

    this.serviceList['post.channel.testEmailConnect'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels/testEmailConnect",
      method: 'post'
    }

    this.serviceList['delete.channel.emailsupport'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels/:id",
      method: 'delete'
    }

    this.serviceList['post.channel.fileUpload'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels/upload",
      method: 'post'
    }

    /** EMAIL SUPPORT API'S END */

    /**  AGENT DEFAULTS SERVICES START */

    this.serviceList['get.defaults'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/defaultsettings?orgId=:orgId&experience=:experience&type=:type",
      method: 'get'
    }

    this.serviceList['post.defaults'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/defaultsettings",
      method: 'post'
    }

    this.serviceList['get.defaults.btDialogs'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/defaultsettings/users/:userId/dialogs?orgId=:orgId&includeCSATDialogs=:includeCSATDialogs",
      method: 'get'
    }


    this.serviceList['get.audioPreview'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/defaultsettings/holdaudio/preview?orgId=:orgId&fileId=:fileId',
      method: 'get'
    }

    this.serviceList['get.defaults.emailsupport'] = {
      endpoint: this.SERVER_URL + "/agentassist/api/v1/channels?searchEmail=:searchEmail&type=:type",
      method: 'get'
    }

    /**  AGENT DEFAULTS SERVICES END */

    /**  SETTINGS THIRD PARTY WIDGETS SERVICES START */

    this.serviceList['put.widgets'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/widgets/:widgetId',
      method: 'put'
    }

    this.serviceList['get.widgetsVariables'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/widgets/variables',
      method: 'get'
    }

    this.serviceList['get.widgets'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/widgets?type=custom',
      method: 'get'
    }

    this.serviceList['post.widgets'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/widgets',
      method: 'post'
    }

    this.serviceList['delete.widgets'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/widgets/:widgetId',
      method: 'delete'
    }

    /**  SETTINGS THIRD PARTY WIDGETS SERVICES START */

    /** SURVEYS CSAT ENDPOINTS START */

    this.serviceList['get.csat.survey'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/csat-survey?name=:name&sortBy=:sortBy&limit=:limit&page=:page',
      method: 'get'
    }

    this.serviceList['post.csat.survey'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/csat-survey',
      method: 'post'
    }

    this.serviceList['get.csat.surveyID'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/csat-survey/:id',
      method: 'get'
    }

    this.serviceList['put.csat.surveyID'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/csat-survey/:id',
      method: 'put'
    }

    this.serviceList['delete.csat.survey'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/csat-survey/:id',
      method: 'delete'
    }

    this.serviceList['get.csat.forms'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/defaultsettings/users/:userId/forms?orgId=:orgId',
      method: 'get'
    }


    /** SURVEYS CSAT ENDPOINTS END */


    this.serviceList['put.market.stream'] = {
      endpoint: this.API_SERVER_URL + '/market/streams/:streamId',
      method: 'put'
    }

    this.serviceList['put.bt.stream'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId',
      method: 'put'
    }

    this.serviceList['delete.bt.stream'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId',
      method: 'delete'
    }

    /** Flows START */

    // To validate flow
    this.serviceList['publish.flowValidate'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/validate',
      method: 'post'
    };
    // To get callflow details
    this.serviceList['publish.callflow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/publish',
      method: 'post'
    }

    this.serviceList['get.callflowList'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows',
      method: 'get'
    }

    this.serviceList['get.channelsCallflowList'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows?name=:name&limit=10&skip=0&sortBy=name&sortOrder=desc&channels[]=rtm&channels[]=audiocodes',
      method: 'get'
    }
    // To create a callflow
    this.serviceList['create.callflow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows',
      method: 'post'
    }
    // To get created nodes with callflow details
    this.serviceList['get.callflow.nodeList'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId',
      method: 'get'
    }
    // To update start node properties callflow details
    this.serviceList['put.callflow.node'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId',
      method: 'put'
    }
    // To get created nodes
    this.serviceList['get.callflow.steps'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps',
      method: 'get'
    }

    // To update node
    this.serviceList['get.step'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps/:stepId',
      method: 'get'
    };

    // To update node
    this.serviceList['step.update'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps/:stepId',
      method: 'put'
    };
    // To create a new node
    this.serviceList['create.node'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps',
      method: 'post'
    }
    // To delete a node
    this.serviceList['step.delete'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps/:stepId',
      method: 'delete'
    };

    // To get all the call flow messages
    this.serviceList['get.callflow.messages'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/messages?name=:name',
      method: 'get'
    }

    // To create the call flow message
    this.serviceList['post.callflow.message'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/messages',
      method: 'post'
    }

    // To create the call flow message
    this.serviceList['put.callflow.message'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/messages/:messageId',
      method: 'put'
    }
    this.serviceList['step.execute'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/steps/:stepId/execute',
      method: 'post'
    };
    // Settings Versioning
    this.serviceList['create.callflow.versions'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/callflows/:callflowId/versions',
      method: 'post'
    }
    this.serviceList['get.callflow.versions'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/callflows/:callflowId/versions?sortByCreatedOn=:sort&startDate=:startDate&endDate=:endDate',
      method: 'get'
    }
    this.serviceList['delete.callflow.version'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/callflows/:callflowId/versions',
      method: 'delete'
    }
    this.serviceList['restore.callflow.version'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/callflows/:callflowId/versions/restore',
      method: 'post'
    }
    this.serviceList['get.restoreVersionStatus'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/callflows/:callflowId/versions/restore/:requestId/status',
      method: 'get'
    };
    /** Expeirence Flows APIs START*/
    this.serviceList['get.expeirence-flows'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows?name=:name',
      method: 'get'
    }
    this.serviceList['get.expeirence-flow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId',
      method: 'get'
    }
    this.serviceList['put.expeirence-flow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId',
      method: 'put'
    }
    this.serviceList['post.expeirence-flow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows',
      method: 'post'
    }
    this.serviceList['delete.expeirence-flow'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId',
      method: 'delete'
    }

    this.serviceList['get.flow.contextVars'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/context/variables',
      method: 'get'
    }
    /** Expeirence Flows APIs END*/
    // AgentDesktop enabiling

    this.serviceList['get.agentDesktopEnabled.info'] = {
      endpoint: this.SERVER_URL + '/agentassist/api/v1/agentdesktop/accounts/isAgentDesktopEnabled',
      method: 'get'
    }

    this.serviceList['get.conversation.callrecoding'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:streamId/recordings/:recordingId',
      method: 'get'
    }


    /**SmartAssist instances START */
    this.serviceList['get.instances'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances',
      method: 'get'
    }

    this.serviceList['post.instances'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances',
      method: 'post'
    }

    this.serviceList['get.automationbots'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/automationbots?isAgentAssist=true',
      method: 'get'
    }

    this.serviceList['post.automationbots'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/automationbots?isAgentAssist=true',
      method: 'post'
    }

    this.serviceList['get.configurationStatus'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:instanceId/configurationStatus',
      method: 'get'
    }

    this.serviceList['post.configurationStatus'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/:instanceId/configurationStatus',
      method: 'post'
    }

    // Channel Voice API's
    // HEADERS: SAT headers
    this.serviceList['delete.voiceNum'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances/:instanceId/channels/voice',
      method: 'delete'
    }

    this.serviceList['get.voiceList'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances/:instanceId/channels/voice?isAgentAssist=true',
      method: 'get'
    }

    this.serviceList['get.chatList'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances/:instanceId/channels/chat?isAgentAssist=true',
      method: 'get'
    }

    this.serviceList['post.voiceType'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances/:instanceId/channels/voice?isAgentAssist=true',
      method: 'post'
    }

    this.serviceList['post.flows.attachPh'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/phoneNumbers',
      method: 'post'
    }

    this.serviceList['update.flows.attachPh'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/callflows/:callflowId/phoneNumbers',
      method: 'put'
    }
    /**SmartAssist instances END */

    this.serviceList['get.externalUrl'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/settings/externalize',
      method: 'post'
    }

    this.serviceList['get.ExpFlowVoicechannels'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/apps/instances/:instanceId/channels?&channel=voice',
      method: 'get'
    }

    this.serviceList['get.smartassist.version'] = {
      endpoint: this.API_SERVER_URL + '/smartassist/version',
      method: 'get'
    }
  }
}
