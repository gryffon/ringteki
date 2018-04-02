const DrawCard = require('../../drawcard.js');

class BentensTouch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Honor a character',
            condition: () => this.game.currentConflict,
            cost: ability.costs.bow(card => card.isFaction('phoenix') && card.hasTrait('shugenja')),
            target: {
                cardType: 'character',
                activePromptTitle: 'Choose a character to honor',
                gameAction: 'honor',
                cardCondition: card => card.isParticipating() && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2} and honor {3}', this.controller, this, context.costs.bow, context.target);
                this.game.applyGameAction(context, { honor: context.target });
            }
        });
    }
}

BentensTouch.id = 'benten-s-touch';

module.exports = BentensTouch;
