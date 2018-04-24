const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card, owner, cardData) {
        super(card);
        this.clone = new DrawCard(owner, cardData);
        this.clone.type = 'attachment';
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    meetsRequirements(context = this.createContext()) {
        this.card.type = 'attachment';
        let error = super.meetsRequirements(context);
        this.card.type = 'character';
        return error;
    }

    resolveTargets(context, results = []) {
        context.source = this.clone;
        return super.resolveTargets(context, results);
    }
    
    executeHandler(context) {
        context.source = this.card;
        context.source.type = 'attachment';
        super.executeHandler(context);
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this, this.owner, this.cardData));
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
    
    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
