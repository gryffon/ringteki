import { CardTypes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');

const DrawCard = require('../../drawcard.js');

class GreaterUnderstanding extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event, context) => event.recepient === context.source.parent
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({
                physicalRing: context.source.parent
            }))
        });
    }
    canAttach(parent) {
        return parent && parent.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
}

GreaterUnderstanding.id = 'greater-understanding';

module.exports = GreaterUnderstanding;

