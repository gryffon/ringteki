const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(originalCard, owner, cardData) {
        super(originalCard);
        this.clone = new DrawCard(owner, cardData);
        this.clone.type = 'attachment';
        this.originalCard = originalCard;
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    meetsRequirements(context = this.createContext()) {
        context.source = this.clone;
        let error = super.meetsRequirements(context);
        if(error === 'location' && context.player.isCardInPlayableLocation(this.originalCard, 'play')) {
            return '';
        }
        return error;
    }

    resolveTargets(context, results = []) {
        context.source = this.clone;
        return super.resolveTargets(context, results);
    }
    
    executeHandler(context) {
        context.source = this.originalCard;
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
