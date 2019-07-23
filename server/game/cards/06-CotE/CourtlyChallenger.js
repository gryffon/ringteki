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
                    message: '{0} is honored due to winning a duel',
                    messageArgs: context => [context.source],
                    gameAction: AbilityDsl.actions.honor()
                }),
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.loser && event.loser === context.source
                    },
                    message: '{0} is dishonored due to losing a duel',
                    messageArgs: context => [context.source],
                    gameAction: AbilityDsl.actions.dishonor()
                })
            ]
        });

        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                gameAction: duel => duel.winner && AbilityDsl.actions.draw({
                    amount: 2,
                    target: duel.winner.controller
                })
            }
        });
    }
}

CourtlyChallenger.id = 'courtly-challenger';

module.exports = CourtlyChallenger;
