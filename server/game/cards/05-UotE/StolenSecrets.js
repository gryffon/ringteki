const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class StolenSecrets extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Steal one of opponent\'s top 4 cards',
            condition: context => this.game.isDuringConflict('political') && context.player.opponent && context.player.opponent.conflictDeck.size() > 0,
            cost: ability.costs.removeFate(card => card.isParticipating()),
            effect: 'look at the top 4 cards of {1}\'s conflict deck and remove one from the game',
            effectArgs: context => context.player.opponent,
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a card to remove from the game',
                context: context,
                cards: context.player.opponent.conflictDeck.first(4),
                cardHandler: card => this.stealCard(card, context.player.opponent.conflictDeck.first(4).filter(c => c !== card), context)
            })
        });
    }

    stealCard(card, remainingCards, context) {
        card.owner.removeCardFromPile(card);
        card.controller = context.player;
        card.moveTo(Locations.RemovedFromGame);
        context.player.removedFromGame.unshift(card);
        context.source.lastingEffect(ability => ({
            until: {
                onCardMoved: event => event.card === card && event.originalLocation === Locations.RemovedFromGame
            },
            match: card,
            effect: [
                ability.effects.hideWhenFaceUp(),
                ability.effects.canPlayFromOwn(Locations.RemovedFromGame, [card])
            ]
        }));
        this.game.checkGameState();
        if(remainingCards.length > 1) {
            this.rearrangePrompt(context, remainingCards, [], 'Which card do you want to be on top?');
        }
    }

    rearrangePrompt(context, promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.push(card);
                promptCards = promptCards.filter(c => c !== card);
                if(promptCards.length > 1) {
                    this.rearrangePrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                }
                orderedCards.push(promptCards[0]);
                context.player.opponent.conflictDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}

StolenSecrets.id = 'stolen-secrets'; // This is a guess at what the id might be - please check it!!!

module.exports = StolenSecrets;
