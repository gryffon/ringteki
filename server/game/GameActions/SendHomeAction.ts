import { CardGameAction, CardActionProperties } from './CardGameAction';
import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import { CardTypes, EventNames } from '../Constants';

export interface SendHomeProperties extends CardActionProperties {
}

export class SendHomeAction extends CardGameAction {
    name = 'sendHome';
    eventName = EventNames.OnSendHome;
    effect = 'send {0} home';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return super.canAffect(card, context) && card.isParticipating();
    }

    eventHandler(event) {
        event.context.game.currentConflict.removeFromConflict(event.card);
    }
}
