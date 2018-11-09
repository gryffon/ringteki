const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class MatsuSeventhLegion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: card => card.hasTrait('courtier'),
            targetController: Players.Opponent,
            effect: ability.effects.cardCannot('declareAsDefender')});
    }
}
MatsuSeventhLegion.id = 'matsu-seventh-legion';

module.exports = MatsuSeventhLegion;
