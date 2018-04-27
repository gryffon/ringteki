const DrawCard = require('../../drawcard.js');

class FavoredMount extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });
        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            gameAction: ability.actions.moveToConflict()
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

FavoredMount.id = 'favored-mount';

module.exports = FavoredMount;
