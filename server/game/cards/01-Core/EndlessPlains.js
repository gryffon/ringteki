const ProvinceCard = require('../../provincecard.js');

class EndlessPlains extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            cost: ability.costs.breakSelf(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                gameAction: ability.actions.discardFromPlay(),
                cardCondition: card => card.isAttacking()
            }
        });
    }
}

EndlessPlains.id = 'endless-plains';

module.exports = EndlessPlains;

