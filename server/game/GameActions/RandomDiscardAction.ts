import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames, Locations, Players, TargetModes } from '../Constants';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

export class RandomDiscardAction extends PlayerAction {
    defaultProperties: RandomDiscardProperties = { amount: 1 };

    name = 'discard';
    eventName = EventNames.OnCardsDiscardedFromHand;
    constructor(propertyFactory: RandomDiscardProperties | ((context: AbilityContext) => RandomDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: RandomDiscardProperties = this.getProperties(context);
        return ['make {0} discard {1} cards at random', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: RandomDiscardProperties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.hand.size() > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as RandomDiscardProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.discardedAtRandom = true;
    }

    eventHandler(event): void {
        let player = event.player;
        let amount = Math.min(event.amount, player.hand.size());
        if(amount === 0) {
            return;
        }
        let cardsToDiscard = player.hand.shuffle().slice(0, amount);
        event.discardedCards = cardsToDiscard;
        player.game.addMessage('{0} discards {1} at random', player, cardsToDiscard);

        for(const card of cardsToDiscard) {
            player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }
}
