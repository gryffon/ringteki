const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FuryOfTheDamned extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Double the base military skill',
            condition: context => context.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose bushi characters',
                numCards: 0,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2)
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            message: '{1} is sacrificed due to {0}\'s delayed effect',
                            gameAction: AbilityDsl.actions.sacrifice()
                        })
                    })
                ])
            },
            effect: 'double the base {1} skill of {0} and sacrifice them at the end of the conflict',
            effectArgs: ['military']
        });
    }
}

FuryOfTheDamned.id = 'fury-of-the-damned';

module.exports = FuryOfTheDamned;
