const DrawCard = require('../../drawcard.js');

class Yoritomo extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyBothSkills(() => this.controller.fate)
        });
    }
}

Yoritomo.id = 'yoritomo'; // This is a guess at what the id might be - please check it!!!

module.exports = Yoritomo;
