const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class PlayTogashiKazueAsAttachment extends PlayAttachmentAction {
    constructor(card, owner, cardData) {
        super(card);
        this.clone = new DrawCard(owner, cardData);
        this.clone.type = 'attachment';
        this.title = 'Play Togashi Kazue as an attachment';
    }

    meetsRequirements(context = this.createContext()) {
        let type = this.card.type;
        this.card.type = 'attachment';
        let error = super.meetsRequirements(context);
        this.card.type = type;
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

class TogashiKazue extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTogashiKazueAsAttachment(this, this.owner, this.cardData));
        this.action({
            title: 'Steal a fate',
            condition: context => context.source.type === 'attachment' && context.source.parent.isParticipating(),
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: context => ability.actions.moveFate(context.source),
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectItems: context => context.source.parent
        });
    }

    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
