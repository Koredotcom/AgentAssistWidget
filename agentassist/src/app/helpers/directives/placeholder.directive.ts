import { Directive, ElementRef, Input, OnInit } from "@angular/core";
@Directive({ selector: '[placeholders]' })
export class PlaceHolderDirective implements OnInit {

    constructor(
        public hostElement: ElementRef
    ) { }

    @Input() placeholders:string  = '';
    ngOnInit() {
       if((['checkagentavailability', 'checkbusinesshours']).includes(this.placeholders)){
        this.hostElement.nativeElement.setAttribute("placeholder", "Example : Sorry for inconvenience, there may be some issue. Please contact us after some time");
       }else{
        this.hostElement.nativeElement.setAttribute("placeholder", "Type your message here...");
       }
    }

}
