const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes } = require('../../Constants');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    canResolveTargets(context) {
        context.source.printedType = CardTypes.Attachment;
        let result = super.canResolveTargets(context);
        context.source.printedType = CardTypes.Character;
        return result;
    }

    resolveTargets(context) {
        context.source.printedType = CardTypes.Attachment;
        const targetResults = super.resolveTargets(context);
        context.game.queueSimpleStep(() => {
            if(targetResults.cancelled) {
                context.source.printedType = CardTypes.Character;
            }
        });
        return targetResults;
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this));
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
