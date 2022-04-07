import { Injectable } from "@angular/core";
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { catchError, map } from "rxjs/operators";
import { BotsNDialogs, DefExperience, DefType, Language } from "./agent-defaults.model";
import { workflowService } from '@kore.services/workflow.service';
import { Observable, throwError } from "rxjs";
import { AuthService } from "@kore.services/auth.service";


@Injectable({ providedIn: 'root' })

export class AgentDefaultsService {

    private _languages: Language[] = [];

    constructor(private service: ServiceInvokerService,
        private workflowService: workflowService,
        private authService: AuthService) { }


    getLanguages(): Observable<Language[]> {
        if(this._languages.length > 0) {
            return new Observable(observer => observer.next(this._languages))
        } else {
            return this.service.invoke('get.agentLangSettings').pipe(
                map(response => response[0]?.languages)
            )
        }
    }

    getDefaultsAgent(orgId: string | boolean, experience: DefExperience, type: DefType) {
        const params = {
            orgId: orgId,
            experience: experience,
            type: type
        }
        return this.service.invoke('get.defaults', params).pipe(
            map((defaultsResponse: any) => {
                if (defaultsResponse.type == 'OFF_WORKING_HOURS') {
                    return defaultsResponse;
                }
                return defaultsResponse;
            },
                catchError(error => {
                    this.workflowService.showError(error, '');
                    return throwError(error);
                })
            )
        )
    }

    getAgentGroups() {
        const params = {
            name: "",
            sortBy: "",
            limit: -1,
            page: 1
        };
        return this.service.invoke('get.agentsGp', params).pipe(
            map(agents => agents.results)
        );
    }

    getBotsNDialogs(): Observable<BotsNDialogs[]> {
        const params = {
            userId: this.authService.getUserId(),
            orgId: this.authService.getOrgId(),
            includeCSATDialogs: true
        }
        return this.service.invoke('get.defaults.btDialogs', params);
    }

    uploadAudioFile(payload) {
        return this.service.invoke('post.uploadfaqfile', null, payload)
    }

    saveDefaultsAgent(payload: any) {
        return this.service.invoke('post.defaults', null, payload).pipe(
            map(response => {
                return response;
            }),
            catchError(error => {
                this.workflowService.showError(error, "");
                return throwError(error);
            })
        )
    }

    previewAudio(params) {
        return this.service.invoke('get.audioPreview', params);
    }

    getAllBotEmailChannels(){
        const params = {
          searchEmail: "",
          type: "emailConnect",
        };
        return this.service.invoke('get.defaults.emailsupport', params).pipe(
            map(response => {
            return response;
          }), 
          catchError(error => {
            return throwError(error);
          })
        )
      }

}