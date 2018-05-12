const PlayerAction = require('./PlayerAction');

class RandomDiscardAction extends PlayerAction {
    constructor(amount = 1) {
        super('discardAtRandom');
        this.amount = amount;
        this.effect = 'discard ' + amount + ' cards at random';
    }

    getEvent(player, context) {
        let amount = Math.min(this.amount, player.hand.size());
        let cards = player.hand.shuffle().slice(0, amount);
        return super.createEvent('onCardsDiscardedFromHand', { player: player, cards: cards, context: context }, event => {
            if(event.cards.length === 0) {
                return;
            }
            player.addGameMessage('{0} discards {1} at random', player, cards);
            if(event.cards.length > 1) {
                player.game.promptForSelect(player, {
                    activePromptTitle: 'Choose order for random discard',
                    mode: 'exactly',
                    numCards: event.card.length,
                    ordered: true,
                    source: context.source,
                    buttons: [{ test: 'Done', arg: 'done' }],
                    cardCondition: card => event.cards.includes(card),
                    onSelect: (player, cards) => {
                        cards = cards.concat(event.cards.filter(card => !cards.includes(card)));
                        for(const card of cards) {
                            player.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                        }
                        return true;
                    }
                });
            } else if(event.cards.length === 1) {
                let card = event.cards[0];
                player.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            }            
        });
    }
}

module.exports = RandomDiscardAction;
