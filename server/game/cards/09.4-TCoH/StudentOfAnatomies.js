import { Players, Durations } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class StudentOfAnatomies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice a character to blank an enemy',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character
            }),
            target: {
                cardCondition: (card) => card.type === CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.blank()
                }),
            },
            effect: 'treat {1} as if it\'s printed text box were blank until the end of the phase',
            effectArgs: context => context.target,
        });
    }
}

StudentOfAnatomies.id = 'student-of-anatomies';

module.exports = StudentOfAnatomies;

