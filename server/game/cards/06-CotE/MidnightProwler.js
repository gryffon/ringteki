const DrawCard = require('../../drawcard.js');

class MidnightProwler extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at the top two card of your opponents conflict deck.',
            when: {
                afterConflict: (event, context) => this.game.isDuringConflict('military') && context.source.isParticipating() && event.conflict.winner === context.player
            },
            handler: (context) => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which card do you want to discard?',
                context: context,
                cards: context.player.opponent.conflictDeck.first(2),
                choices: ['Do not discard either card.'],
                handlers: [() => context.player.opponent.conflictDeck.splice(0, 2, ...context.player.opponent.conflictDeck.first(2))],
                cardHandler: card => {
                    context.player.opponent.moveCard(card, 'conflict discard pile');
                    let cardChoices = context.player.opponent.conflictDeck.first(2);
                    cardChoices.splice(cardChoices.indexOf(card), 1);
                    context.player.opponent.conflictDeck.splice(0, 1, ...cardChoices);
                }
            })
        });
    }
}

MidnightProwler.id = 'midnight-prowler';

module.exports = MidnightProwler;
