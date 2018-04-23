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
        context.source = this.clone;
        let error = super.meetsRequirements(context);
        if(error === 'location' && context.player.isCardInPlayableLocation(this.card, 'play')) {
            return '';
        }
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
    setupCardAbilities() {
        this.abilities.playActions.push(new PlayTogashiKazueAsAttachment(this, this.owner, this.cardData));
        this.action({
            title: 'Steal a fate',
            condition: () => this.type === 'attachment' && this.parent.isParticipating(),
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => card.isParticipating() && card !== this.parent
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to steal a fate from {2} and place it on {3}', this.controller, this, context.target, this.parent);
                let event = this.game.applyGameAction(context, { removeFate: context.target })[0];
                event.recipient = context.source.parent;
            }
        });
    }

    leavesPlay() {
        this.type = 'character';
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
