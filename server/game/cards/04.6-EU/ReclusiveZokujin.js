const DrawCard = require('../../drawcard.js');

class ReclusiveZokujin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('earth'),
            effect: [
                ability.effects.addKeyword('covert'),
                ability.effects.immunity({
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}

ReclusiveZokujin.id = 'reclusive-zokujin'; // This is a guess at what the id might be - please check it!!!

module.exports = ReclusiveZokujin;
