const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class CourtlyChallenger extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.winner && event.winner === context.source
                    },
                    multipleTrigger: true,
                    message: '{0} is honored due to winning a duel',
                    gameAction: AbilityDsl.actions.honor(context => ({ target: context.source }))
                }),
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.loser && event.loser === context.source
                    },
                    multipleTrigger: true,
                    message: '{0} is dishonored due to losing a duel',
                    gameAction: AbilityDsl.actions.dishonor(context => ({ target: context.source }))
                })
            ]
        });

        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0} wins the duel - {1} draws 2 cards',
                messageArgs: context => [context.game.currentDuel.winner, context.game.currentDuel.winner.controller],
                gameAction: AbilityDsl.actions.draw(context => ({
                    amount: 2,
                    target: context.game.currentDuel.winner.controller
                }))
            }
        });
    }
}

CourtlyChallenger.id = 'courtly-challenger';

module.exports = CourtlyChallenger;
