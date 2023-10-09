import { Component, EventEmitter, OnInit, Output } from "@angular/core";
declare const $;
@Component({
  selector: "app-xo-menu",
  templateUrl: "./xo-menu.component.html",
  styleUrls: ["./xo-menu.component.scss"],
})
export class XoMenuComponent implements OnInit {
  constructor() {}
  minimizeSidenavItems = false;
  @Output() minimizeSidenav = new EventEmitter();
  SelectedSideMenu = "";
  ngOnInit(): void {}
  x = {
    subModules: [
      {
        id: "flows",
        name: "lbl_flows_routing",
        icon: "assets/icons/unified-icons/sa-unified-dataflow.svg",
        subModules: [
          {
            id: "flows",
            name: "lbl_conditional_flows",
            icon: "",
            meta: {
              permission: ["FLOW_MANAGEMENT_VIEW"],
              moduleRoute: "flows",
            },
          },
          {
            id: "wait-experiences",
            name: "Waiting Flows",
            icon: "",
            meta: {
              permission: ["WAITING_EXPERIENCE_VIEW"],
              moduleRoute: "wait-experiences",
            },
          },
        ],
      },
      {
        id: "queues",
        name: "ROUTING",
        icon: "assets/icons/unified-icons/sa-unified-reverse-right.svg",
        subModules: [
          {
            id: "queues",
            name: "Queues",
            icon: "",
            meta: {
              permission: ["QUEUE", "QUEUE_SETTINGS_VIEW"],
              moduleRoute: "queues",
            },
          },
          {
            id: "skills",
            name: "Skills",
            icon: "",
            meta: {
              permission: [
                "SKILL_SETTING_MANAGEMENT_VIEW",
                "SKILL_MANAGEMENT_VIEW",
              ],
              moduleRoute: "skills",
            },
          },
        ],
      },
      {
        id: "users",
        name: "AGENT & SUPERVISORS",
        icon: "assets/icons/unified-icons/sa-unified-users.svg",
        subModules: [
          {
            id: "users",
            name: "Agent Management",
            icon: "",
            meta: {
              permission: [
                "AGENT_SETTING_MANAGEMENT_VIEW",
                "USER_MANAGEMENT_VIEW",
                "USER_MANAGEMENT_VIEW_AND_INVITE",
              ],
              moduleRoute: "users",
            },
            subModules: [
              {
                id: "users",
                name: "Agents",
                icon: "",
                meta: {
                  permission: [
                    "AGENT_SETTING_MANAGEMENT_VIEW",
                    "USER_MANAGEMENT_VIEW",
                    "USER_MANAGEMENT_VIEW_AND_INVITE",
                  ],
                  moduleRoute: "users",
                },
              },
              {
                id: "agents",
                name: "Agent Groups",
                icon: "",
                meta: {
                  permission: [
                    "AGENT_SETTING_MANAGEMENT_VIEW",
                    "AGENT_GROUP_MANAGEMENT_VIEW",
                  ],
                  moduleRoute: "agents",
                },
              },
              {
                id: "agentStatus",
                name: "Agent Status",
                icon: "",
                meta: {
                  permission: ["AGENT_STATUS_VIEW"],
                  moduleRoute: "agentStatus",
                },
              },
              {
                id: "agents-settings",
                name: "Agent Settings",
                icon: "",
                meta: {
                  permission: [
                    "AGENT_SETTING_MANAGEMENT_VIEW",
                    "AGENT_SETTINGS_VIEW",
                  ],
                  moduleRoute: "agents-settings",
                },
              },
            ],
          },
          {
            id: "dispositioncodes",
            name: "Dispositions",
            icon: "",
            meta: {
              permission: [
                "DISPOSITION_MANAGEMENT_VIEW",
                "DISPOSITION_MANAGEMENT_YES",
              ],
              moduleRoute: "dispositioncodes",
            },
            subModules: [
              {
                id: "sets",
                name: "Disposition Sets",
                icon: "",
                meta: {
                  permission: [
                    "DISPOSITION_MANAGEMENT_VIEW",
                    "DISPOSITION_MANAGEMENT_YES",
                  ],
                  moduleRoute: "sets",
                },
              },
              {
                id: "codes",
                name: "Disposition Codes",
                icon: "",
                meta: {
                  permission: [
                    "DISPOSITION_MANAGEMENT_VIEW",
                    "DISPOSITION_MANAGEMENT_YES",
                  ],
                  moduleRoute: "codes",
                },
              },
            ],
          },
        ],
      },
      {
        id: "operationalHours",
        name: "CONFIGURATIONS",
        icon: "assets/icons/unified-icons/sa-unified-configurations.svg",
        subModules: [
          {
            id: "operationalHours",
            name: "Hours of Operation",
            icon: "",
            meta: {
              permission: ["HOURS_OF_OPERATION_VIEW"],
              moduleRoute: "operationalHours",
            },
          },
          {
            id: "languages",
            name: "Languages & Speech",
            icon: "",
            meta: {
              permission: [
                "LANGUAGE_AND_SPEECH_CONTROL_VIEW",
                "LANGUAGE_AND_SPEECH_CONTROL_YES",
              ],
              moduleRoute: "languages",
            },
          },
          {
            id: "agentsDefaults",
            name: "Default Flows",
            icon: "",
            meta: {
              permission: ["DEFAULT_FLOWS_VIEW", "DEFAULT_FLOWS_YES"],
              moduleRoute: "agentsDefaults",
            },
          },
          {
            id: "agent-assist",
            name: "Response Templates",
            icon: "",
            meta: {
              permission: ["STANDARD_RESPONSE_VIEW", "STANDARD_RESPONSES_VIEW"],
              moduleRoute: "agent-assist",
            },
          },
          {
            id: "surveys",
            name: "Surveys",
            icon: "",
            meta: {
              permission: ["SURVEY_MANAGEMENT_VIEW", "SURVEY_MANAGEMENT_YES"],
              moduleRoute: "surveys",
            },
          },
          {
            id: "forms",
            name: "Secure Forms",
            icon: "",
            meta: {
              permission: ["SURVEY_MANAGEMENT_VIEW", "SURVEY_MANAGEMENT_YES"],
              moduleRoute: "forms",
            },
          },
          {
            id: "widgets",
            name: "Widgets",
            icon: "",
            meta: {
              permission: ["WIDGET_MANAGEMENT_VIEW", "WIDGET_MANAGEMENT_YES"],
              moduleRoute: "widgets",
            },
          },
          {
            id: "channels",
            name: "Email Inbox Config",
            icon: "",
            meta: {
              permission: ["CHANNEL_MANAGEMENT_VIEW", "CHANNEL_MANAGEMENT_YES"],
              moduleRoute: "channels",
            },
          },
          {
            id: "agentAssistSettings",
            name: "AgentAssist Settings",
            icon: "",
            meta: {
              permission: ["AGENT_ASSIST_SETTINGS_VIEW"],
              moduleRoute: "agentAssistSettings",
            },
          },
          {
            id: "api-setup",
            name: "Advanced Settings",
            icon: "",
            meta: {
              permission: ["API_VIEW", "API_YES"],
              moduleRoute: "api-setup",
            },
            subModules: [
              {
                id: "avdapi-setup",
                name: "API Setup",
                icon: "",
                meta: {
                  permission: ["API_VIEW", "API_YES"],
                  moduleRoute: "api-setup",
                },
              },
              {
                id: "advanced-settings",
                name: "Advanced Settings",
                icon: "",
                meta: {
                  permission: [
                    "WFM_CONFIG_MANAGEMENT_YES",
                    "WIDGET_MANAGEMENT_VIEW",
                    "WIDGET_MANAGEMENT_YES",
                  ],
                  moduleRoute: "advanced-settings",
                },
              },
            ],
          },
        ],
      },
    ],
  };
  blurFrame: any;

  toggleLeftNav(){
    this.minimizeSidenavItems = !this.minimizeSidenavItems;
    
    if(this.minimizeSidenavItems) {
      $(".right-wrapper-dynamic-content").addClass('active');
      this.minimizeSidenav.emit(true);

    } else {
      this.SelectedSideMenu = "";
      $(".right-wrapper-dynamic-content").removeClass('active');
      this.minimizeSidenav.emit(false);
    }
  }
}
