const DrawCard = require('../../drawcard.js');

class SilvertonguedMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.isParticipating() && card.fate === 0 && card !== this,
            targetController: 'any',
            effect: ability.effects.cannotCountForResolution()
        });
    }
}

SilvertonguedMagistrate.id = 'silver-tongued-magistrate';

module.exports = SilvertonguedMagistrate;
