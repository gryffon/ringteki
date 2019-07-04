import { CardTypes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const DrawCard = require('../../drawcard.js');

class GreaterUnderstanding extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onMoveFate: (event) => event.recipient === this.parent,
                onPlaceFateOnUnclaimedRings: () => !this.parent.claimed
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ target: context.source.parent }))
        });
    }
    canAttach(ring) {
        return ring && ring.type === 'ring';
    }
    canPlayOn(source) {
        return source && source.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
    mustAttachToRing() {
        return true;
    }
}

GreaterUnderstanding.id = 'greater-understanding';

module.exports = GreaterUnderstanding;

