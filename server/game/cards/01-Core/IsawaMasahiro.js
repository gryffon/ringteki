const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class IsawaMasahiro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to discard an enemy character' ,
            condition: () => this.game.isDuringConflict('fire'),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.costLessThan(3) && card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

IsawaMasahiro.id = 'isawa-masahiro';

module.exports = IsawaMasahiro;
