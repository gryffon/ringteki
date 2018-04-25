const DrawCard = require('../../drawcard.js');

class FavoredMount extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });
        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            condition: context => context.source.parent.allowGameAction('moveToConflict', context),
            message: '{0} bows {1} to move {2} into the conflict',
            messageItems: context => [context.source.parent],
            handler: context => this.game.applyGameAction(context, { moveToConflict: context.source.parent })
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
