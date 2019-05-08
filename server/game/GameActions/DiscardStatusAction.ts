import { TokenAction, TokenActionProperties} from './TokenAction';
import { EventNames } from '../Constants';

export interface DiscardStatusProperties extends TokenActionProperties {
}

export class DiscardStatusAction extends TokenAction {
    name = 'discardStatus';
    eventName = EventNames.OnStatusTokenDiscarded;
    effect = 'discard {0}\'s status token';
    cost = 'discarding {0}\'s status token';

    eventHandler(event): void {
        if(event.token.card.personalHonor === event.token) {
            event.token.card.makeOrdinary();
        }
    }
}
