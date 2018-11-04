const DrawCard = require('../../drawcard.js');

class CourtNovice extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.air.isConsideredClaimed(context.player) ||
                this.game.rings.water.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

CourtNovice.id = 'court-novice';

module.exports = CourtNovice;
