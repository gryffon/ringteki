const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class MonasteryProtector extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.getType() === CardTypes.Character && card.controller === context.source.controller && card.hasTrait('tattooed'),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.fateCostToTarget()
        });


    }
}

MonasteryProtector.id = 'monastery-protector';

module.exports = MonasteryProtector;

