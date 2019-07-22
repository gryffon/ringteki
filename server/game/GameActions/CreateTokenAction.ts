import { CardGameAction, CardActionProperties } from "./CardGameAction";

import { Locations, CardTypes, EventNames } from '../Constants';
import AbilityContext = require("../AbilityContext");
import BaseCard = require('../basecard');
import Effects = require('../effects');

export interface CreateTokenProperties extends CardActionProperties {
}

export class CreateTokenAction extends CardGameAction {
    name = 'createToken';
    effect = 'create a token';
    targetType = [CardTypes.Character, CardTypes.Holding];

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        if(!card.facedown || !card.isInProvince() || card.location === Locations.StrongholdProvince) {
            return false;
        } else if(!context.game.isDuringConflict('military')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event, additionalProperties = {}): void {
        let context = event.context;
        let card = event.card;
        let token = context.game.createToken(card);
        card.owner.removeCardFromPile(card);
        this.checkForRefillProvince(card, event, additionalProperties);
        card.moveTo(Locations.RemovedFromGame);
        card.owner.moveCard(token, Locations.PlayArea);
        if(context.player.isAttackingPlayer()) {
            context.game.currentConflict.addAttacker(token);
        } else {
            context.game.currentConflict.addDefender(token);
        }
        context.game.actions.cardLastingEffect({
            effect: Effects.delayedEffect({
                when: {
                    onConflictFinished: () => true
                },
                message: '{0} returns to the deep',
                messageArgs: [token],
                gameAction: context.game.actions.discardFromPlay()    
            })
        }).resolve(token, context);
    }
}
