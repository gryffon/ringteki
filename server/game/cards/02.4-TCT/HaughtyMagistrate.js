const DrawCard = require('../../drawcard.js');

class HaughtyMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isParticipating() && card.getGlory() < this.getGlory() && card !== this,
            targetController: 'any',
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

HaughtyMagistrate.id = 'haughty-magistrate';

module.exports = HaughtyMagistrate;
