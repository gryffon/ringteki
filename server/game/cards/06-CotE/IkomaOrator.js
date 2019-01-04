const DrawCard = require('../../drawcard.js');

class IkomaOrator extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (context.player.opponent && context.player.honor > context.player.opponent.honor),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

IkomaOrator.id = 'ikoma-orator';

module.exports = IkomaOrator;
