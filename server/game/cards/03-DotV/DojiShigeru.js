const DrawCard = require('../../drawcard.js');

class DojiShigeru extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards a card',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: event => {
                    return (event.player === this.controller.opponent && 
                            event.card.type === 'event' && 
                            this.game.currentConflict.isParticipating());
                }
            },

            handler: () => {
                this.game.addMessage('{0} uses {1} to force {2} to choose and discard a card', this.controller, this, this.controller.opponent);
                //Text for discarding a chosen card from hand (see: night raid, resoration)
                let num = 1;
                let prompt = 'Choose a card to discard';
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: prompt,
                    source: this,
                    cardCondition: card => card.location === 'hand',
                    numCards: num,
                    mode: 'exactly',
                    ordered: true,
                    multiSelect: false,
                    onSelect: (player, card) => {
                        player.discardCardsFromHand(card);
                        return true;
                    }
                });
            }
        });
    }
}

DojiShigeru.id = 'doji-shigeru';

module.exports = DojiShigeru;
