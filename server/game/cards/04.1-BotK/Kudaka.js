const DrawCard = require('../../drawcard.js');

class Kudaka extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.reaction({
            title: 'Gain 1 fate and draw 1 card',
            limit: ability.limit.perRound(2),
            effect: 'gain 1 fate and draw 1 card',
            when: {
                onClaimRing: (event, context) => event.conflict && event.conflict.ring.element === 'air' && event.player === context.player
            },
            gameAction: [ability.actions.gainFate(), ability.actions.draw()]
        });
    }
}

Kudaka.id = 'kudaka'; // This is a guess at what the id might be - please check it!!!

module.exports = Kudaka;
