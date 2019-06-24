import { CardTypes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const PlayAttachmentAction = require('../../playattachmentaction.js');

const DrawCard = require('../../drawcard.js');


class PlayGreaterUnderstandingOnRing extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Greater Understanding as an attachment to a ring';
    }

    canResolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        let result = super.canResolveTargets(context);
        context.source.type = 'ring';
        return result;
    }

    resolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        const targetResults = super.resolveTargets(context);
        context.game.queueSimpleStep(() => {
            if(targetResults.cancelled) {
                context.source.type = 'ring';
            }
        });
        return targetResults;
    }
}

class GreaterUnderstanding extends DrawCard {
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayGreaterUnderstandingOnRing(this));
        this.reaction({
            when: {
                onMoveFate: (event, context) => event.recepient === context.source.parent
            },
            title: 'Resolve the attached ring\'s effect',
            gameAction: AbilityDsl.actions.resolveRingEffect(context => ({ target: context.source.parent }))
        });
    }
    canAttach(parent) {
        return parent && parent.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
    canPlayOn(source) {
        return source && source.getType() === 'ring' && this.getType() === CardTypes.Attachment;
    }
}

GreaterUnderstanding.id = 'greater-understanding';

module.exports = GreaterUnderstanding;

