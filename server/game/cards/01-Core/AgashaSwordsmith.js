const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class AgashaSwordsmith extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 card for attachment',
            limit: ability.limit.perRound(1),
            effect: 'look at the top five cards of their deck',
            handler: context => {
                let attachments = _.filter(context.player.conflictDeck.first(5), card => card.type === 'attachment');
                let choices = ['Take nothing'];
                let handlers = [() => {
                    this.game.addMessage('{0} takes nothing', context.player);                    
                    context.player.shuffleConflictDeck();
                    return true;
                }];
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card',
                    context: context,
                    cards: attachments,
                    choices: choices,
                    handlers: handlers,
                    cardHandler: card => {
                        context.player.moveCard(card, 'hand');
                        this.game.addMessage('{0} takes {1} and adds it to their hand', context.player, card);
                        context.player.shuffleConflictDeck();
                    }
                });
            }
        });
    }
}

AgashaSwordsmith.id = 'agasha-swordsmith';

module.exports = AgashaSwordsmith;

