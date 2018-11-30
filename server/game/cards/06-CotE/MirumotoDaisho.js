const DrawCard = require('../../drawcard.js');

class MirumotoDaisho extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotHaveOtherRestrictedAttachments(this)
        });

        this.persistentEffect({
            condition: context => this.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: 'opponent',
            effect: [
                ability.effects.cannotBidInDuels('1'),
                ability.effects.cannotBidInDuels('5')
            ]
        });
    }
}

MirumotoDaisho.id = 'mirumoto-daisho';

module.exports = MirumotoDaisho;
