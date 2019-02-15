const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class LoyalChallenger extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.winner === context.player &&
                            context.source.isParticipating()
                    },
                    multipleTrigger: true,
                    message: '{2} gains 1 honor due to {0} winning a conflict',
                    messageArgs: context => [context.player],
                    gameAction: AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
                })
                ,
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.loser === context.player &&
                            context.source.isParticipating()
                    },
                    multipleTrigger: true,
                    message: '{2} loses 1 honor due to {0} losing a conflict',
                    messageArgs: context => [context.player],
                    gameAction: AbilityDsl.actions.loseHonor(context => ({ target: context.player }))
                })
            ]
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: context => ({
                type: DuelTypes.Political,
                resolutionHandler: (winner, loser) => this.resolutionHandler(context, winner, loser)
            })
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} loses the duel and is blanked until the end of the conflict', loser);
            this.game.actions.cardLastingEffect({ effect: AbilityDsl.effects.blank() }).resolve(loser, context);
        } else {
            this.game.addMessage('{0} wins the duel, but there is no loser of the duel', winner);
        }
    }
}

LoyalChallenger.id = 'loyal-challenger';

module.exports = LoyalChallenger;
