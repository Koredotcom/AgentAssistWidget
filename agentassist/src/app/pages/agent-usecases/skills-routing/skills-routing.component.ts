import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { Skill } from 'src/app/data/skills.model';
import { SkillLite } from '../../wait-experiences/wait-experiences.model';
import * as _ from 'underscore';

@Component({
  selector: 'app-skills-routing',
  templateUrl: './skills-routing.component.html',
  styleUrls: ['./skills-routing.component.scss']
})
export class SkillsRoutingComponent implements OnInit {
  responseGroup: any = {};
  allSkillGpsList: string[] = [];
  allSkillsList: string[] = [];
  shortenSkGp: SkillLite[] = [];
  allSkillNGps: any = [];
  allSkills: Skill[];
  agentGroups: any[] = [];
  selectedAgentGroups: any = [];
  editMode: boolean = false;

  @Input() inputAGs: any[] = [];
  @Input() routingList: any[] = [];
  constructor(
    private service: ServiceInvokerService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    if (this.routingList.length === 0) {
      this.routingList = [{
        steps: [{
          entity: "",
          values: [],
          order: 1,
          operator: 'OR' || 'AND',
          entityDetails: { id: "", name: "" },
          valueDetails: [{ id: "", name: "" }]

        }],
        operator: 'OR' || 'AND',
        order: 1
      }];
    }

    this.getSkillsGps();
  }



  getSkillsGps() {
    const params = {
      orgId: this.authService.getOrgId(),
      limit: -1
    };
    this.service.invoke('get.allSkills', params).subscribe(
      res => {
        this.allSkillNGps = res.results;
        _.each(res.results, val => { this.shortenSkGp.push(_.pick(val, 'name', 'skillGroupName', 'color', '_id')) });
        this.allSkillGpsList = _.uniq(_.pluck(this.shortenSkGp, 'skillGroupName'));
        this.allSkillsList = _.uniq(_.pluck(this.shortenSkGp, 'name'));
      }, err => {
        this.notificationService.showError(err, "");
      }
    );
  }

  getSkillGpId(groupName) {
    let skill: any = _.findWhere(this.allSkillNGps, { "skillGroupName": groupName });
    return skill?.skillGroupId;
  }

  getSkillId(skillName) {
    let skill: any = _.findWhere(this.allSkillNGps, { "name": skillName });
    return skill?._id;
  }


  getSkillMatchRules() {
    let routingList: any = JSON.parse(JSON.stringify(this.routingList));

    routingList.forEach(item1 => {
      item1.steps.forEach(item2 => {
        delete item2.entityDetails;
        delete item2.valueDetails;
        item2.entity = this.getSkillGpId(item2.entity);
        let arr: any = [];
        item2.values.forEach(item3 => {
          arr.push(this.getSkillId(item3))
        });
        item2.values = _.uniq(arr);
      });
    });

    return routingList;
  }


}
