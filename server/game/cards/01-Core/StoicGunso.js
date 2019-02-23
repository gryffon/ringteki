const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class StoicGunso extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character for +3/+0',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'give himself +3{1}/+0{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyMilitarySkill(3) })
        });
    }
}

StoicGunso.id = 'stoic-gunso';

module.exports = StoicGunso;
