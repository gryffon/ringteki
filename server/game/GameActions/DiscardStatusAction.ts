import { TokenAction, TokenActionProperties} from './TokenAction';
import { EventNames } from '../Constants';

export interface DiscardStatusProperties extends TokenActionProperties {
}

export class DiscardStatusAction extends TokenAction {
    name = 'discardStatus';
    eventName = EventNames.OnCardStatusDiscarded;
    effect = 'discard {0}\'s status token';

    eventHandler(event): void {
        event.token.card.makeOrdinary();
    }
}
