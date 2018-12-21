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

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ChosenDiscardProperties;
        return ['make {0} discard {1} cards', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}) {
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
                context.game.promptForSelect(player, {
                    activePromptTitle: 'Choose ' + (amount === 1 ? 'a card' : (amount + ' cards')) + ' to discard',
                    context: context,
                    mode: TargetModes.Exactly,
                    numCards: amount,
                    ordered: true,
                    location: Locations.Hand,
                    controller: player === context.player ? Players.Self : Players.Opponent,
                    onSelect: (player, cards) => {
                        events.push(super.createEvent(EventNames.OnCardsDiscardedFromHand, { player, cards, context }, event => {
                            context.game.addMessage('{0} discards {1}', player, cards);
                            for(let card of event.cards) {
                                player.moveCard(card, card.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
                            }
                        }));
                        return true;
                    }
                });
            }
        }
    }
}
