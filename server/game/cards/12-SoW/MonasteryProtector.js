const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class MonasteryProtector extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.getType() === CardTypes.Character && card.controller === context.source.controller && card.hasTrait('tattooed'),
            effect: AbilityDsl.effects.fateCostToTarget({
                amount: 1,
                cardType: CardTypes.Event,
                targetPlayer: Players.Opponent
            })
        });
    }
}

MonasteryProtector.id = 'monastery-protector';

module.exports = MonasteryProtector;

