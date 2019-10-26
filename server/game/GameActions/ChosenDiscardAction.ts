import AbilityContext = require('../AbilityContext');
import Player = require('../player');

import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { Locations, Players, TargetModes, EventNames } from '../Constants';

export interface ChosenDiscardProperties extends PlayerActionProperties {
    amount?: number;
}

export class ChosenDiscardAction extends PlayerAction {
    defaultProperties: ChosenDiscardProperties = {
        amount: 1
    };
    name = 'discard';
    eventName = EventNames.OnCardsDiscardedFromHand;

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ChosenDiscardProperties;
        return ['make {0} discard {1} cards', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        if(player.hand.size() === 0 || properties.amount === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        for(let player of properties.target as Player[]) {
            let amount = Math.min(player.hand.size(), properties.amount);
            if(amount > 0) {
                if(context.choosingPlayerOverride && context.choosingPlayerOverride !== player) {
                    let event = this.getEvent(player, context) as any;
                    event.cards = player.hand.shuffle().slice(0, amount);
                    events.push(event);
                    return;
                }
                context.game.promptForSelect(player, {
                    activePromptTitle: 'Choose ' + (amount === 1 ? 'a card' : (amount + ' cards')) + ' to discard',
                    context: context,
                    mode: TargetModes.Exactly,
                    numCards: amount,
                    ordered: true,
                    location: Locations.Hand,
                    controller: player === context.player ? Players.Self : Players.Opponent,
                    onSelect: (player, cards) => {
                        let event = this.getEvent(player, context) as any;
                        event.cards = cards;
                        events.push(event);
                        return true;
                    }
                });
            }
        }
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { amount } = this.getProperties(context, additionalProperties) as ChosenDiscardProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.cards = [];
    }

    eventHandler(event): void {
        event.context.game.addMessage('{0} discards {1}', event.player, event.cards);
        for(let card of event.cards) {
            event.player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
        }
    }
}
