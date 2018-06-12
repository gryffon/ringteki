const DrawCard = require('../../drawcard.js');

class MeekInformant extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal opponent\'s hand',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.player.opponent
            },
            effect: 'reveal {1}\'s hand',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.reveal().target(context => context.player.opponent.hand.toArray())
        });
    }
}

MeekInformant.id = 'meek-informant';

module.exports = MeekInformant;
