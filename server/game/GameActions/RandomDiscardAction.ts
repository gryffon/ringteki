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
        player.game.addMessage('{0} discards {1} at random', player, cardsToDiscard);
        if(amount === 1) {
            let card = cardsToDiscard[0];
            player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            return;
        }
        let handler = (player, cards = []) => {
            cards = cards.concat(cardsToDiscard.filter(card => !cards.includes(card)));
            for(const card of cards) {
                player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            }
            return true;
        };
        player.game.promptForSelect(player, {
            activePromptTitle: 'Choose order for random discard',
            mode: TargetModes.UpTo,
            numCards: cardsToDiscard.length,
            optional: true,
            ordered: true,
            location: Locations.Hand,
            controller: Players.Self,
            source: event.context.source,
            cardCondition: card => cardsToDiscard.includes(card),
            onSelect: handler,
            onCancel: handler
        });
    }
}
