const PlayerAction = require('./PlayerAction');

class ChosenDiscardAction extends PlayerAction {
    constructor(amount = 1) {
        super('discard');
        this.amount = amount;
        this.effect = 'discard {1} cards';
        this.effectArgs = () => {
            return this.amount;
        };
        this.cards = [];
    }

    canAffect(player, context) {
        if(player.hand.size() === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        const player = this.targets[0];
        let amount = Math.min(player.hand.size(), this.amount);
        if(amount === 0) {
            return;
        }
        context.game.promptForSelect(player, {
            activePromptTitle: 'Choose ' + (amount === 1 ? 'a card' : amount + ' cards') + ' to discard',
            source: context.source,
            mode: 'exactly',
            numCards: amount,
            ordered: true,
            cardCondition: card => card.location === 'hand' && card.controller === player,
            onSelect: (player, cards) => {
                this.cards = cards;
                context.game.addMessage('{0} discards {1}', player, cards);
                return true;
            }
        });
    }

    getEventArray(context) {
        if(this.cards.length === 0) {
            return [];
        }
        return super.getEventArray(context);
    }

    getEvent(player, context) {
        return super.createEvent('onCardsDiscardedFromHand', { player: player, cards: this.cards, context: context }, event => {
            for(const card of event.cards) {
                player.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            }
        });
    }
}

module.exports = ChosenDiscardAction;
