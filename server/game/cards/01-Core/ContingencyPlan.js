const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const ModifyBidAction = require('../../GameActions/ModifyBidAction');

class ContingencyPlan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Change your bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            gameAction: AbilityDsl.actions.modifyBid({ direction: ModifyBidAction.Direction.Prompt })
        });
    }
}

ContingencyPlan.id = 'contingency-plan';

module.exports = ContingencyPlan;
