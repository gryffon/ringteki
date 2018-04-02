const DrawCard = require('../../drawcard.js');

class MantraOfFire extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Add 1 fate to a monk and draw a card',
            when: {
                onConflictDeclared: event => event.conflictRing === 'fire' && event.conflict.attackingPlayer !== this.controller
            },
            target: {
                cardType: 'character',
                gameAction: 'placeFate',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk'))
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to add fate to {2} and draw a card', this.controller, this, context.target);
                this.game.applyGameAction(context, { placeFate: context.target }, [{
                    handler: () => this.controller.drawCardsToHand(1)
                }]);
            }
        });
    }
}

MantraOfFire.id = 'mantra-of-fire';

module.exports = MantraOfFire;
