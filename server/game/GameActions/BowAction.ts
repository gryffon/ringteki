import { CardGameAction, CardActionProperties } from './CardGameAction';

import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { Locations, CardTypes, EventNames } from '../Constants';

export interface BowActionProperties extends CardActionProperties {}

export class BowAction extends CardGameAction {
    name = 'bow';
    eventName = EventNames.OnCardBowed;
    cost = 'bowing {0}';
    effect = 'bow {0}';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Stronghold];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(card.location !== Locations.PlayArea && card.type !== CardTypes.Stronghold || card.bowed) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event): void {
        event.card.bow();
    }
}
