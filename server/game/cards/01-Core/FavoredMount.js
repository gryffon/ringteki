const DrawCard = require('../../drawcard.js');

class FavoredMount extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }
}

FavoredMount.id = 'favored-mount';

module.exports = FavoredMount;
