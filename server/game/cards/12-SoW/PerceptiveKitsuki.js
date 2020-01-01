const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PerceptiveKitsuki extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at your opponent\'s hand',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.returnRings(1),
            effect: 'look at {1}\'s hand',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.lookAt(context => ({ target: context.player.opponent.hand.sortBy(card => card.name), chatMessage: true }))
        });
    }
}

PerceptiveKitsuki.id = 'perceptive-kitsuki';

module.exports = PerceptiveKitsuki;
