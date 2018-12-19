import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import EntersPlayEvent = require('../Events/EntersPlayEvent');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes }  from '../Constants';

export interface PutIntoPlayProperties extends CardActionProperties {
    fate?: number,
    status?: string
}

export class PutIntoPlayAction extends CardGameAction {
    name = 'putIntoPlay';
    cost = 'putting {0} into play';
    targetType = [CardTypes.Character];
    intoConflict: boolean;
    defaultProperties: PutIntoPlayProperties = { 
        fate: 0,
        status: 'ordinary'
    };
    constructor(properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties, intoConflict = false) {
        super(properties);
        this.intoConflict = intoConflict;
    }

    getEffectMessage(): [string, any[]] {
        return ['put {0} into play' + (this.intoConflict ? ' in the conflict' : ''), []];
    }

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!context.player || card.anotherUniqueInPlay(context.player)) {
            return false;
        } else if(card.location === Locations.PlayArea || card.facedown) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict) {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((context.player.isAttackingPlayer() && !card.canParticipateAsAttacker()) ||
                (context.player.isDefendingPlayer() && !card.canParticipateAsDefender())) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions('putIntoPlay', context)) {
                return false;
            }
        }
        return true;
    }
    
    getEvent(card: DrawCard, context: AbilityContext): Event {
        let { fate, status } = this.getProperties(context) as PutIntoPlayProperties;
        return new EntersPlayEvent({ intoConflict: this.intoConflict, context: context }, card, fate, status, this);
    }
}
