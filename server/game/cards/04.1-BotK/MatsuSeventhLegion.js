const DrawCard = require('../../drawcard.js');

class MatsuSeventhLegion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: card => card.hasTrait('courtier'),
            targetController: 'opponent',
            effect: ability.effects.cardCannot('declareAsDefender')});
    }
}
MatsuSeventhLegion.id = 'matsu-seventh-legion';

module.exports = MatsuSeventhLegion;
