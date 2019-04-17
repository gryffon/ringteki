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
            effect: 'remove the top 4 cards from {1}\'s deck: {2}{3}{4}{5}{6} and make them playable {7}until the end of the round',
            effectArgs: context => [
                context.player,
                context.player.conflictDeck.first(4),
                context.player.opponent ? ' and the top 4 cards from ' : '',
                context.player.opponent,
                context.player.opponent ? '\'s deck: ' : '',
                context.player.opponent && context.player.opponent.conflictDeck.first(4),
                context.player.opponent ? 'by both players ' : ''
            ],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: Players.Self,
                    duration: Durations.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.canPlayFromOwn(Locations.RemovedFromGame, context.player.conflictDeck.first(4)),
                        AbilityDsl.effects.canPlayFromOpponents(Locations.RemovedFromGame, context.player.opponent.conflictDeck.first(4))
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
