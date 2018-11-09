const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes } = require('../../Constants');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    canResolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        let result = super.canResolveTargets(context);
        context.source.type = CardTypes.Character;
        return result;
    }

    resolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        return super.resolveTargets(context);
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
        this.type = CardTypes.Character;
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
