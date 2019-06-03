const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class AlibiArtist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: context => context.player.honor <= 6,
            effect: 'look at the top two cards of their conflict deck',
            handler: context => {
                if(context.player.conflictDeck.size() === 0) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to put in your hand',
                    context: context,
                    cards: context.player.conflictDeck.first(2),
                    choices: context.player.conflictDeck.size() === 1 ? ['Take Nothing'] : [],
                    handlers: [() => {
                        this.game.addMessage('{0} puts a card on the bottom of their conflict deck', context.player);
                    }],
                    cardHandler: card => {
                        this.game.addMessage('{0} puts a card in their hand', context.player);
                        context.player.moveCard(card, Locations.Hand);
                        if(context.player.conflictDeck.size() > 0) {
                            this.game.queueSimpleStep(() => context.player.moveCard(context.player.conflictDeck.first(), Locations.ConflictDeck, { bottom: true }));
                            this.game.addMessage('{0} puts a card on the bottom of their conflict deck', context.player);
                        }
                    }
                });
            }
        });
    }
}

AlibiArtist.id = 'alibi-artist';

module.exports = AlibiArtist;
