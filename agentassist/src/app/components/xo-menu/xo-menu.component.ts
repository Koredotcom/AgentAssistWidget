import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { assetUrl } from "src/single-spa/asset-url";
import { singleSpaPropsSubject } from "src/single-spa/single-spa-props";
import { SubSink } from 'subsink';
declare const $;
@Component({
  selector: "app-xo-menu",
  templateUrl: "./xo-menu.component.html",
  styleUrls: ["./xo-menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class XoMenuComponent implements OnInit {
  constructor() {}
  minimizeSidenavItems = false;
  @Output() minimizeSidenav = new EventEmitter();
  @Output() menuItemSelected = new EventEmitter();
  SelectedSideMenu = "";
  subs = new SubSink();
  assetURLProc = assetUrl;
  sspaSubscriptionRef;
  ngOnInit(): void {
    this.sspaSubscriptionRef =  singleSpaPropsSubject.subscribe((res:any)=>{
      console.log(res);
      this.x = res.module;
    });
  }
  x = {
    subModules: [
      {
        id: "agent_exp",
        name: "AGENT EXPERIENCE",
        icon: "assets/icons/unified-icons/Iconusers.svg",
        subModules: [
          {
            id: "coaching",
            name: "Agent Coaching",
            icon: "",
            meta: {
              permission: [""],
              moduleRoute: "coaching",
            },
          },
          {
            id: "playbook",
            name: "Agent Playbook",
            icon: "",
            meta: {
              permission: [""],
              moduleRoute: "guided-checklist",
            },
            subModules: [
              {
                id: "static",
                name: "Static",
                icon: "",
                meta: {
                  permission: [],
                  moduleRoute: "static",
                },
              },
              {
                id: "dynamic",
                name: "Dynamic",
                icon: "",
                meta: {
                  permission: [],
                  moduleRoute: "dynamic",
                },
              },
            ],
          },
        ],
      },
      {
        id: "agent_configurations",
        name: "CONFIGURATIONS",
        icon: "assets/icons/unified-icons/Iconsettings.svg",
        subModules: [
          {
            id: "events",
            name: "Welcome Events",
            icon: "",
            meta: {
              permission: [],
              moduleRoute: "welcomeEvents",
            },
          },
          {
            id: "widgets",
            name: "widgets",
            icon: "",
            meta: {
              permission: [],
              moduleRoute: "widget-settings",
            },
          },
        ],
      }
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

  showSubMenuUnified(module){
    if(this.minimizeSidenavItems){
      this.SelectedSideMenu = module
    }
  }

  sidebarViewUpdate(view) {
    console.log('sidebar', view);
    this.blurFrame = view.open;
  }
  
  menuSelected(item){
    this.menuItemSelected.emit(item);
  }


  ngOnDestroy() {
    this.subs?.unsubscribe();
    this.sspaSubscriptionRef?.unsubscribe();
  }
}
