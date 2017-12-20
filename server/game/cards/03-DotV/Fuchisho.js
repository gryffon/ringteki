const DrawCard = require('../../drawcard.js');

class Fushicho extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Resurrect a character',
            when: {
                onCardLeavesPlay: event => event.card === this
            },
            target: {
                activePrompt: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'dynasty discard pile' && this.controller.canPutIntoPlay(card) &&
                                   card.controller === this.controller && card.isFaction('phoenix')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resurrect {2}', this.controller, this, context.target);
                this.controller.putIntoPlay(context.target);
                context.target.fate = 1; // 1 fate gets removed as part of the phase - is there a better way to do this?
            }
        }
        );
    }
}

Fushicho.id = 'fushicho';

module.exports = Fushicho;
