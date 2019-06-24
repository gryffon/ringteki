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
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ target: context.source.parent }))
        });
    }
    canAttach(ring, context) {
        return ring.element === context.ring.element;
    }
    canPlayOn(source) {
        return source && source.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
}

GreaterUnderstanding.id = 'greater-understanding';

module.exports = GreaterUnderstanding;

