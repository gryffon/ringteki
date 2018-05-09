const DrawCard = require('../../drawcard.js');

class SeekerInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onClaimRing: (event, context) => context.player.role && event.conflict.elements.some(element => context.player.role.hasTrait(element)) && 
                                                 event.player === context.player && context.player.conflictDeck.size() > 0
            },
            effect: 'look at the top 5 cards of their conflict deck',
            handler: context => {
                let myTopFive = context.player.conflictDeck.first(5);
                if(myTopFive.length > 1) {
                    this.game.promptWithHandlerMenu(context.player, {
                        source: context.source,
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

SeekerInitiate.id = 'seeker-initiate';

module.exports = SeekerInitiate;
