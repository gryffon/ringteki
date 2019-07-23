const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class LoyalChallenger extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.winner === context.source.controller &&
                            context.source.isParticipating()
                    },
                    message: '{0} gains 1 honor due to {1} winning a conflict',
                    messageArgs: context => [context.source.controller, context.source],
                    gameAction: AbilityDsl.actions.gainHonor(context => ({ target: context.source.controller }))
                })
                ,
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.loser === context.source.controller &&
                            context.source.isParticipating()
                    },
                    message: '{2} loses 1 honor due to {0} losing a conflict',
                    messageArgs: context => [context.source.controller, context.source],
                    gameAction: AbilityDsl.actions.loseHonor(context => ({ target: context.source.controller }))
                })
            ]
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0} is blanked until the end of the conflict',
                messageArgs: duel => duel.loser,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.loser,
                    effect: AbilityDsl.effects.blank()
                })
            }
        });
    }
}

LoyalChallenger.id = 'loyal-challenger';

module.exports = LoyalChallenger;
