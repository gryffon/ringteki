const DrawCard = require('../../drawcard.js');

class ObstinateRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.delayedEffect({
                condition: () => this.controller.opponent && this.controller.opponent.honor > this.controller.honor,
                gameAction: 'discardFromPlay'
            })
        });
    }
}

ObstinateRecruit.id = 'obstinate-recruit';

module.exports = ObstinateRecruit;
