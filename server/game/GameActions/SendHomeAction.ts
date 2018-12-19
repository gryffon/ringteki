import { CardGameAction, CardActionProperties } from './CardGameAction';
import BaseCard = require('../basecard');
import AbilityContext = require('../AbilityContext');
import Event = require('../Events/Event');
import { CardTypes, EventNames } from '../Constants';

export interface SendHomeProperties extends CardActionProperties {
}

export class SendHomeAction extends CardGameAction {
    name = 'sendHome';
    effect = 'send {0} home';
    targetType = [CardTypes.Character];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        return super.canAffect(card, context) && card.isParticipating();
    }

    getEvent(card: BaseCard , context: AbilityContext): Event {
        return super.createEvent(EventNames.OnSendHome, { card, context }, event => context.game.currentConflict.removeFromConflict(event.card));
    }
}
