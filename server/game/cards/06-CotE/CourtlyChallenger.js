const DrawCard = require('../../drawcard.js');

class CourtlyChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.winner && event.winner === context.source
                    },
                    multipleTrigger: true,
                    message: '{0} is honored due to winning a duel',
                    gameAction: ability.actions.honor(context => ({ target: context.source }))
                }),
                ability.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.loser && event.loser === context.source
                    },
                    multipleTrigger: true,
                    message: '{0} is dishonored due to losing a duel',
                    gameAction: ability.actions.dishonor(context => ({ target: context.source }))
                })
            ]
        });

        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: context => ({
                type: 'political',
                resolutionHandler: winner => this.resolutionHandler(context, winner)
            })
        });
    }
    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel - {1} draws 2 cards', winner, winner.controller);
        this.game.actions.draw({ amount: 2 }).resolve(winner.controller, context);
    }
}

CourtlyChallenger.id = 'courtly-challenger';

module.exports = CourtlyChallenger;