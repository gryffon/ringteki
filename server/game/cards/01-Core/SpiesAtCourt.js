const DrawCard = require('../../drawcard.js');

class SpiesAtCourt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard 2 cards',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.type === 'political' && this.controller.opponent
            },
            cost: ability.costs.dishonor(card => card.isParticipating()),
            max: ability.limit.perConflict(1),
            handler: context => {
                this.game.addMessage('{0} dishonors {1} and plays {2} to force {3} to discard 2 cards at random', this.controller, context.costs.dishonor, this, this.controller.opponent);
                this.controller.opponent.discardAtRandom(2, context.source);
            }
        });
    }
}

SpiesAtCourt.id = 'spies-at-court';

module.exports = SpiesAtCourt;
