const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

class ShrewdYasuki extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: context => context.player.conflictDeck.size() > 0 && context.source.isParticipating() &&
                                  this.game.allCards.some(card => card.type === CardTypes.Holding && card.location.includes('province') && !card.facedown),
            effect: 'look at the top two cards of their conflict deck',
            handler: context => {
                if(context.player.conflictDeck.size() === 0) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to put in your hand',
                    context: context,
                    cards: context.player.conflictDeck.first(2),
                    cardHandler: card => {
                        this.game.addMessage('{0} takes one card to their hand and puts the other on the bottom of their deck', context.player);
                        context.player.moveCard(card, Locations.Hand);
                        if(context.player.conflictDeck.size() > 0) {
                            this.game.queueSimpleStep(() => context.player.moveCard(context.player.conflictDeck.first(), Locations.ConflictDeck, { bottom: true }));
                        }
                    }
                });
            }
        });
    }
}

ShrewdYasuki.id = 'shrewd-yasuki';

module.exports = ShrewdYasuki;
