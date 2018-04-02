const DrawCard = require('../../drawcard.js');

class GaijinCustoms extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a non-unicorn character',
            condition: () => this.controller.anyCardsInPlay(card => card.isFaction('unicorn')) || this.controller.stronghold.isFaction('unicorn'),
            target: {
                cardType: 'character',
                gameAction: 'ready',
                cardCondition: card => !card.isFaction('unicorn')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { ready: context.target });
            }
        });
    }
}

GaijinCustoms.id = 'gaijin-customs';

module.exports = GaijinCustoms;
