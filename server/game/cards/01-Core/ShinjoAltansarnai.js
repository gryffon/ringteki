const DrawCard = require('../../drawcard.js');

class ShinjoAltansarnai extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard a character',
            when: {
                onBreakProvince: event => event.conflict.type === 'military' && this.isAttacking()
            },
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                player: 'opponent',
                gameAction: 'discardFromPlay',
                cardCondition: card => card.controller !== this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}, forcing {2} to discard {3}', this.controller, this, this.controller.opponent, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target });
            }
        });
    }
}

ShinjoAltansarnai.id = 'shinjo-altansarnai';

module.exports = ShinjoAltansarnai;
