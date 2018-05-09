const DrawCard = require('../../drawcard.js');

class MeekInformant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal opponent\'s hand',
            when: {
                onCardPlayed: event => event.card === this && this.controller.opponent && this.controller.opponent.hand.size() > 0
            },
            effect: 'reveal {1}\'s hand: {2}',
            effectArgs: context => [context.player.opponent, context.player.opponent.hand.sortBy(card => card.name)]
        });
    }
}

MeekInformant.id = 'meek-informant';

module.exports = MeekInformant;
