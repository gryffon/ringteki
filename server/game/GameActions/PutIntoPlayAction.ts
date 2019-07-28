import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames }  from '../Constants';

export interface PutIntoPlayProperties extends CardActionProperties {
    fate?: number,
    status?: string
}

export class PutIntoPlayAction extends CardGameAction {
    name = 'putIntoPlay';
    eventName = EventNames.OnCharacterEntersPlay;
    cost = 'putting {0} into play';
    targetType = [CardTypes.Character];
    intoConflict: boolean;
    defaultProperties: PutIntoPlayProperties = { 
        fate: 0,
        status: 'ordinary'
    };
    constructor(properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties, intoConflict = true) {
        super(properties);
        this.intoConflict = intoConflict;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['put {0} into play' + (this.intoConflict ? ' in the conflict' : ''), [target]];
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

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { fate, status } = this.getProperties(context, additionalProperties) as PutIntoPlayProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.fate = fate;
        event.status = status;
        event.intoConflict = this.intoConflict;
        event.originalLocation = card.location;      
    }

    eventHandler(event, additionalProperties = {}): void {
        this.checkForRefillProvince(event.card, event, additionalProperties);
        event.card.new = true;
        if(event.fate) {
            event.card.fate = event.fate;
        }
        
        event.context.player.moveCard(event.card, Locations.PlayArea);
        
        if(event.status === 'honored') {
            event.card.honor();
        } else if(event.status === 'dishonored') {
            event.card.dishonor();
        }

        if(event.intoConflict) {
            if(event.context.player.isAttackingPlayer()) {
                event.context.game.currentConflict.addAttacker(event.card);
            } else {
                event.context.game.currentConflict.addDefender(event.card);
            }
        }
    }
}
