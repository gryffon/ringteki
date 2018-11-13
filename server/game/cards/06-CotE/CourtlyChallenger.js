const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class CourtlyChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.delayedEffect({
                    when: {
                        afterDuel: (event) => event.winner && event.winner === this
                    },
                    multipleTrigger: true,
                    message: '{0} is honored due to winning a duel',
                    gameAction: ability.actions.honor(context => ({ target: context.source }))
                }),
                ability.effects.delayedEffect({
                    when: {
                        afterDuel: (event) => event.loser && event.loser === this
                    },
                    multipleTrigger: true,
                    message: '{0} is dishonored due to losing a duel',
                    gameAction: ability.actions.dishonor(context => ({ target: context.source }))
                })
            ]
        });
        this.action({
            title: 'Initiate a Political duel',
            condition: () => this.isParticipating(),
            target: {
                cardtype: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: 'political',
                    challenger: context.source,
                    resolutionHandler: (winner) => this.resolutionHandler(context, winner)
                }))
            }
        });
    }
    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel - {1} draws 2 cards', winner, winner.controller);
        this.game.applyGameAction(context, { draw: [winner.controller, winner.controller] });
    }
}

CourtlyChallenger.id = 'courtly-challenger';

module.exports = CourtlyChallenger;
