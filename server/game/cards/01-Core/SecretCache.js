const ProvinceCard = require('../../provincecard.js');

class SecretCache extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            effect: 'look at the top 5 cards of their conflict deck',
            handler: context => {
                let myTopFive = context.player.conflictDeck.first(5);
                if(myTopFive.length > 1) {
                    this.game.promptWithHandlerMenu(context.player, {
                        context: context,
                        activePromptTitle: 'Choose a card',
                        cards: myTopFive,
                        cardHandler: card => {
                            this.game.addMessage('{0} takes a card into their hand', context.player);
                            context.player.moveCard(card, 'hand');
                            context.player.shuffleConflictDeck();                    
                        }
                    });
                } else {
                    this.game.addMessage('{0} takes the last card from their conflict deck into their hand', context.player);
                    context.player.moveCard(myTopFive[0], 'hand');
                }
            }
        });
    }
}

SecretCache.id = 'secret-cache';

module.exports = SecretCache;
