const ProvinceCard = require('../../provincecard.js');
const { Players } = require('../../Constants');

class EndlessPlains extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            cost: ability.costs.breakSelf(),
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to discard',
                controller: Players.Opponent,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

EndlessPlains.id = 'endless-plains';

module.exports = EndlessPlains;

