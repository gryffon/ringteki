const _ = require('underscore');
const AllPlayerPrompt = require('../allplayerprompt.js');

class MulliganDynastyPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedCards = {};
        _.each(game.getPlayers(), player => this.selectedCards[player.name] = []);
    }

    completionCondition(player) {
        return !!player.takenDynastyMulligan;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        _.each(this.game.getPlayers(), player => {
            let selectableCards = this.game.allCards.filter(card => (
                card.controller === player && this.cardCondition(card)
            ));
            player.setSelectableCards(selectableCards);
        });
    }

    activePrompt() {
        return {
            selectCard: true,
            selectRing: true,
            menuTitle: 'Select dynasty cards to mulligan',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'Dynasty Mulligan',
        };
    }

    onCardClicked(player, card) {
        if(!player || !this.activeCondition(player) || !card) {
            return false;
        }
        if(!this.cardCondition(card)) {
            return false;
        }

        if(!this.selectedCards[player.name].includes(card)) {
            this.selectedCards[player.name].push(card);
        } else {
            this.selectedCards[player.name] = this.selectedCards[player.name].filter(c => c !== card);
        }
        player.setSelectedCards(this.selectedCards[player.name]);
    }

    cardCondition(card) {
        return card.isDynasty && ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to mulligan dynasty cards',
        };
    }

    menuCommand(player, arg) {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    player.moveCard(card, 'dynasty deck bottom');
                }
                player.fillProvinces();
                player.shuffleDynastyDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the dynasty deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all dynasty cards', player);
            }
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.takenDynastyMulligan = true;
            return true;
        }
        return false;
    }
}

module.exports = MulliganDynastyPrompt;
