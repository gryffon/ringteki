const AbilityDsl = require('../../abilitydsl.js');
const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class VanguardWarrior extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice to put fate on one character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.placeFate()
            }
        });
    }
}

VanguardWarrior.id = 'vanguard-warrior';

module.exports = VanguardWarrior;
