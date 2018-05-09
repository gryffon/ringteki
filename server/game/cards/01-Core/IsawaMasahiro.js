const DrawCard = require('../../drawcard.js');

class IsawaMasahiro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to discard an enemy character' ,
            condition: () => this.game.isDuringConflict() && this.game.currentConflict.hasElement('fire'),
            cost: ability.costs.bowSelf(),
            target: {
                cardCondition: card => card.getCost() <= 2 && card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

IsawaMasahiro.id = 'isawa-masahiro';

module.exports = IsawaMasahiro;
