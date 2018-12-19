import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import EffectSource = require('../EffectSource');
import { CardTypes } from '../Constants.js';

export interface CardActionProperties extends GameActionProperties {
    target?: BaseCard | BaseCard[];
}

export class CardGameAction extends GameAction {
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Holding, CardTypes.Event, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role];

    defaultTargets(context: AbilityContext): EffectSource[] {
        return [context.source];
    }

    checkEventCondition(event): boolean {
        return this.canAffect(event.card, event.context);
    }

    canAffect(card: BaseCard, context: AbilityContext) {
        return super.canAffect(card, context);
    }
}
