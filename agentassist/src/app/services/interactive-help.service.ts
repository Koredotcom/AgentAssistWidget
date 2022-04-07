import { Injectable } from '@angular/core';
declare const inline_manual_player: any;

@Injectable({ providedIn: 'root' })
export class InteractiveHelpService {

    topicHelpMap = {
        INITIAL_PRODUCT_TOUR: '97612',
        BOT_SETUP_EXPLANATION: '97961',
        EXPLORE_USE_CASES: '98003',
        EXPLORE_EXPERIENCE_FLOWS: '98004'
    };

    constructor() { }


    openHelp(helpId: string) {
        if (inline_manual_player && this.topicHelpMap[helpId]) {
            inline_manual_player.activateTopic(this.topicHelpMap[helpId]);
        }
    }

}