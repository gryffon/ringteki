const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class PoliticalSanctions extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
        });
    }

    canPlay(context, playType) {
        if(context.game.isDuringConflict('political')) {
            let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
            return context.player.isAttackingPlayer() ? diff > 0 : diff < 0 &&
                super.canPlay(context, playType);
        }

        return false;
    }

    canAttach(card, context) {
        return card.isParticipating() && super.canAttach(card, context);
    }
}

PoliticalSanctions.id = 'political-sanction';

module.exports = PoliticalSanctions;
