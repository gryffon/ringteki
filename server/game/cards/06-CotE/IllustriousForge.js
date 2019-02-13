const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Players } = require('../../Constants');

class IllustriousForge extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search for an attachment',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && context.player.conflictDeck.size() > 0
            },
            effect: 'search the top 5 cards of {1}\'s conflict deck for an attachment and put it into play',
            effectArgs: context => context.player,
            handler: context => context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose an attachment',
                context: context,
                cards: context.player.conflictDeck.first(5),
                cardCondition: card => card.getType() === CardTypes.Attachment && context.player.cardsInPlay.any(cardInPlay => card.canAttach(cardInPlay, context)),
                choices: ['Take nothing'],
                handlers: [() => {
                    context.game.addMessage('{0} takes nothing', context.player);
                    context.player.shuffleConflictDeck();
                }],
                cardHandler: attachment => {
                    context.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character',
                        controller: Players.Self,
                        cardCondition: card => attachment.canAttach(card, context),
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} chooses to attach {1} to {2}', player, attachment, card);
                            context.game.actions.attach({
                                attachment: attachment
                            }).resolve(card, context);
                            return true;
                        }
                    });
                }
            })
        });
    }
}

IllustriousForge.id = 'illustrious-forge';

module.exports = IllustriousForge;
