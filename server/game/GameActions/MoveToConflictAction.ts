import { CardGameAction, CardActionProperties } from './CardGameAction';

import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { Locations, CardTypes, EventNames } from '../Constants';

export interface MoveToConflictProperties extends CardActionProperties {
}

export class MoveToConflictAction extends CardGameAction {
    name = 'moveToConflict';
    eventName = EventNames.OnMoveToConflict;
    effect = 'move {0} into the conflict';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(!context.game.currentConflict || card.isParticipating()) {
            return false;
        }
        if(card.controller.isAttackingPlayer()) {
            if(!card.canParticipateAsAttacker()) {
                return false;
            }
        } else if(!card.canParticipateAsDefender()) {
            return false;
        }
        return card.location === Locations.PlayArea;
    }

    eventHandler(event): void {
        if(event.card.controller.isAttackingPlayer()) {
            event.context.game.currentConflict.addAttacker(event.card);
        } else {
            event.context.game.currentConflict.addDefender(event.card);
        }        
    }
}
