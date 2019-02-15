const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class TacticiansCamp extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isHonored,
            effect: ability.effects.modifyMilitarySkill(1)
        });
    }
}

TacticiansCamp.id = 'tactician-s-camp';

module.exports = TacticiansCamp;

