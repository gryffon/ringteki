const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');

class FairAccord extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard favor to gain 2 fate',
            phase: Phases.Dynasty,
            cost: ability.costs.discardImperialFavor(),
            gameAction: ability.actions.gainFate({ amount: 2 })
        });
    }
}

FairAccord.id = 'fair-accord';

module.exports = FairAccord;
