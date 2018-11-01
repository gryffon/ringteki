const DrawCard = require('../../drawcard.js');

class PoliticalRival extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}

PoliticalRival.id = 'political-rival';

module.exports = PoliticalRival;
