const DrawCard = require('../../drawcard.js');

class Yoritomo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(card => card.controller.fate)
        });
    }
}

Yoritomo.id = 'yoritomo';

module.exports = Yoritomo;
