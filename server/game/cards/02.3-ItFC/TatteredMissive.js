const DrawCard = require('../../drawcard.js');

class TatteredMissive extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 cards',
            condition: context => context.player.conflictDeck.size() > 0,
            cost: ability.costs.bowParent(),
            effect: 'look at the top 5 cards of their conflict deck',
            handler: context => {
                let cards = context.player.conflictDeck.first(5);
                if(cards.length > 1) {
                    this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Select a card to reveal and put in your hand',
                        cards: cards,
                        cardHandler: card => {
                            this.game.addMessage('{0} reveals {1} and adds it to their hand', context.player, card);
                            context.player.moveCard(card, 'hand');
                            context.player.shuffleConflictDeck();
                        },
                        source: context.source
                    });
                } else {
                    this.game.addMessage('{0} reveals {1} and adds it to their hand', context.player, cards[0]);
                    context.player.moveCard(cards[0], 'hand');
                }
            }
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('courtier') || card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

TatteredMissive.id = 'tattered-missive';

module.exports = TatteredMissive;
