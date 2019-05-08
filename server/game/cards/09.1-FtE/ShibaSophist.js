const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ShibaSophist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Search top 5 card for a card with the contested ring trait',
            condition: context => context.source.isParticipating(),
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: card => this.game.currentConflict.elements.some(element => card.hasTrait(element))
            })
        });
    }
}

ShibaSophist.id = 'shiba-sophist';

module.exports = ShibaSophist;

