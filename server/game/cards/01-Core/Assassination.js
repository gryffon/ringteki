const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class Assassination extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a character',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.payHonor(3),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.costLessThan(3),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

Assassination.id = 'assassination';

module.exports = Assassination;
