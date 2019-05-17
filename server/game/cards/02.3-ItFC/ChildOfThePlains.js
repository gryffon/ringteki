const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ChildOfThePlains extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Get first action',
            when: {
                onCardRevealed: (event, context) =>
                    context.source.isAttacking() && this.game.currentConflict.conflictProvince === event.card && event.onDeclaration
            },
            effect: 'get the first action in this conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                effect: AbilityDsl.effects.gainActionPhasePriority()
            })
        });
    }
}

ChildOfThePlains.id = 'child-of-the-plains';

module.exports = ChildOfThePlains;
