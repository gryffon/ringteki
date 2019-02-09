const DrawCard = require('../../drawcard.js');

class IaijutsuMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Change your bid by 1 during a duel',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    this.game.currentDuel && this.game.currentDuel.isInvolved(context.source.parent)
            },
            gameAction: ability.actions.modifyBid({ direction: 'prompt' })
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('duelist')) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

IaijutsuMaster.id = 'iaijutsu-master';

module.exports = IaijutsuMaster;
