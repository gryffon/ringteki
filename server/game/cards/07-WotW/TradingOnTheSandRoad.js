const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Durations, Phases, Players } = require('../../Constants');

class TradingOnTheSandRoad extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Take top 4 cards from both players\' decks',
            when: {
                onPhaseCreated: event => event.phase === Phases.Draw
            },
            effect: 'remove the top 4 cards from each player\'s deck and make them playable by both players until the end of the round',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.lookAt(context=> ({
                    target: context.player.conflictDeck.first(4),
                    message: '{0} removes the top {1} cards from their conflict deck from the game: {2}',
                    messageArgs: cards => [context.player, cards.length, cards]
                })),
                AbilityDsl.actions.lookAt(context=> ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.first(4) : [],
                    message: '{0} removes the top {1} cards from their conflict deck from the game: {2}',
                    messageArgs: cards => [context.player.opponent, cards.length, cards]
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: Players.Self,
                    duration: Durations.UntilEndOfRound,
                    effect: context.player.opponent ? [
                        AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, context.player.conflictDeck.first(4)),
                        AbilityDsl.effects.canPlayFromOpponents(Locations.RemovedFromGame, context.player.opponent.conflictDeck.first(4))
                    ] : [
                        AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, context.player.conflictDeck.first(4))
                    ]

                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: Players.Opponent,
                    duration: Durations.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, context.player.opponent.conflictDeck.first(4)),
                        AbilityDsl.effects.canPlayFromOpponents(Locations.RemovedFromGame, context.player.conflictDeck.first(4))
                    ]
                })),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.conflictDeck.first(4),
                    destination: Locations.RemovedFromGame
                })),
                AbilityDsl.actions.moveCard(context => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.first(4) : [],
                    destination: Locations.RemovedFromGame
                }))
            ])
        });
    }
}

TradingOnTheSandRoad.id = 'trading-on-the-sand-road';

module.exports = TradingOnTheSandRoad;
