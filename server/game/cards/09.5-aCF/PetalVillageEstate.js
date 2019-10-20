const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class PetalVillageEstate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.hasTrait('imperial'),
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}

PetalVillageEstate.id = 'petal-village-estate';

module.exports = PetalVillageEstate;
