import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import Event = require('../Events/Event');
import { EventNames, Locations, Players, TargetModes } from '../Constants';

export interface RandomDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

export class RandomDiscardAction extends PlayerAction {
    defaultProperties: RandomDiscardProperties = { amount: 1 };

    name = 'discard';
    constructor(propertyFactory: RandomDiscardProperties | ((context: AbilityContext) => RandomDiscardProperties)) {
        super(propertyFactory);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: RandomDiscardProperties = this.getProperties(context);
        return ['make {0} discard {1} cards at random', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties: RandomDiscardProperties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && super.canAffect(player, context);
    }

    getEvent(player: Player, context: AbilityContext, additionalProperties = {}): Event {
        let properties: RandomDiscardProperties = this.getProperties(context, additionalProperties);
        let amount = Math.min(properties.amount, player.hand.size());
        let cards = player.hand.shuffle().slice(0, amount);
        return super.createEvent(EventNames.OnCardsDiscardedFromHand, { player, cards, context }, event => {
            if(event.cards.length === 0) {
                return;
            }
            player.game.addMessage('{0} discards {1} at random', player, cards);
            let handler = (player, cards = []) => {
                cards = cards.concat(event.cards.filter(card => !cards.includes(card)));
                for(const card of cards) {
                    player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
                }
                return true;
            };
            if(event.cards.length > 1) {
                player.game.promptForSelect(player, {
                    activePromptTitle: 'Choose order for random discard',
                    mode: TargetModes.UpTo,
                    numCards: event.cards.length,
                    optional: true,
                    ordered: true,
                    location: Locations.Hand,
                    controller: Players.Self,
                    source: context.source,
                    cardCondition: card => event.cards.includes(card),
                    onSelect: handler,
                    onCancel: handler
                });
            } else if(event.cards.length === 1) {
                let card = event.cards[0];
                player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            }
        });
    }
}
