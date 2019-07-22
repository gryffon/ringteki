const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Durations, CardTypes } = require('../../Constants');

class PurityOfSpirit extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a bushi character to honor',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.delayedEffect({
                            when : {
                                onConflictFinished: () => true
                            },
                            message: '{0} is removed from {1} due to the delayed effect of {2}',
                            messageArgs: [context.target.personalHonor, context.target, context.source],
                            gameAction: AbilityDsl.actions.discardStatusToken(() => ({ target: context.target.personalHonor }))
                        })
                    }))
                ])
            }
        });
    }
}

PurityOfSpirit.id = 'purity-of-spirit';

module.exports = PurityOfSpirit;
