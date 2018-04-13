const DrawCard = require('../../drawcard.js');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at opponent\'s hand',
            max: ability.limit.perConflict(1),
            condition: () => this.isParticipating() && this.game.currentConflict.type === 'political' && this.controller.opponent && this.controller.opponent.hand.size() > 0,
            cost: ability.costs.payFateToRing(1),
            handler: () => {
                let sortedHand = this.controller.opponent.hand.sortBy(card => card.name);
                this.game.addMessage('{0} uses {1} to reveal {2}\'s hand: {3}', this.controller, this, this.controller.opponent, sortedHand);
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose card to discard',
                    cards: sortedHand,
                    cardHandler: card => {
                        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', this.controller, this, card, this.controller.opponent);
                        this.controller.opponent.discardCardFromHand(card);
                    },
                    source: this
                });
            }
        });
    }
}

KitsukiInvestigator.id = 'kitsuki-investigator';

module.exports = KitsukiInvestigator;
