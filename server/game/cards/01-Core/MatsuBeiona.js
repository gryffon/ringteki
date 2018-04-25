const DrawCard = require('../../drawcard.js');

class MatsuBeiona extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                onCardEntersPlay: (event, context) => (
                    event.card === context.source &&
                    context.source.allowGameAction('placeFate', context) && 
                    context.player.filterCardsInPlay(card => (
                        card.hasTrait('bushi') && 
                        card.getType() === 'character' && 
                        card !== context.source
                    )).length >= 3
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to put 2 fate on {1}', this.controller, this);
                let event = this.game.applyGameAction(context, { placeFate: context.source })[0];
                event.fate = 2;
            }
        });
    }
}

MatsuBeiona.id = 'matsu-beiona';

module.exports = MatsuBeiona;
