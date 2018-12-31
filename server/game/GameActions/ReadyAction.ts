import { CardGameAction, CardActionProperties } from './CardGameAction';

import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import { Locations, CardTypes, EventNames } from '../Constants';

export interface ReadyProperties extends CardActionProperties {}

export class ReadyAction extends CardGameAction {
    name = 'ready';
    eventName = EventNames.OnCardReadied;
    cost = 'readying {0}';
    effect = 'ready {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea && card.type !== CardTypes.Stronghold || !card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event) {
        event.card.ready();
    }
}
