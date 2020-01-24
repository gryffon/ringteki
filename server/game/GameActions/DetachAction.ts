import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface DetachActionProperties extends CardActionProperties {
}

export class DetachAction extends CardGameAction {
    name = 'detach';
    eventName = EventNames.OnCardDetached;
    targetType = [CardTypes.Attachment];

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let target = this.getProperties(context).target as any;
        return ['detach {1} from {0}', [target, target.parent]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        return card && card.location === Locations.PlayArea && card.parent && super.canAffect(card, context, additionalProperties);
    }

    eventHandler(event): void {
        event.card.parent.removeAttachment(event.card);
        event.card.controller.cardsInPlay.push(event.card);
    }
}
