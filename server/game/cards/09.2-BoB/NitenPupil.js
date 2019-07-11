const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Durations } = require('../../Constants');

class NitenPupil extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Double base skills',
            when: {
                onHonorDialsRevealed: (event, context) => event.duel && event.duel.isInvolved(context.source)
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: [
                    AbilityDsl.effects.modifyBaseMilitarySkill(context.source.getBaseMilitarySkill()),
                    AbilityDsl.effects.modifyBasePoliticalSkill(context.source.getBasePoliticalSkill())
                ],
                duration: Durations.UntilEndOfPhase
            })),
            effect: 'double {0}\'s base {1} and {2} skills',
            effectArgs: ['military', 'political']
        });
    }
}

NitenPupil.id = 'niten-pupil';

module.exports = NitenPupil;
