const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class PoliticalSanctions extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
        });
    }

    canAttach(card, context) {
        let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
        return context.game.isDuringConflict('political') &&
            context.player.isAttackingPlayer() ? diff < 0 : diff > 0 &&
            card.isParticipating() &&
            super.canAttach(card, context);
    }
}

PoliticalSanctions.id = 'political-sanctions';

module.exports = PoliticalSanctions;
