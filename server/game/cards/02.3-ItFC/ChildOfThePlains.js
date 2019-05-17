const DrawCard = require('../../drawcard.js');

class ChildOfThePlains extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Get first action',
            when: {
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && this.game.currentConflict.conflictProvince === event.card && event.onDeclaration
            },
            effect: 'get the first action in this conflict',
            gameAction: ability.actions.playerLastingEffect({
                effect:ability.effects.gainActionPhasePriority()
            })
        });
    }
}

ChildOfThePlains.id = 'child-of-the-plains';

module.exports = ChildOfThePlains;
