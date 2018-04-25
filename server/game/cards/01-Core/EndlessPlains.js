const ProvinceCard = require('../../provincecard.js');

class EndlessPlains extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard a character',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source && event.conflict.attackers.length > 0
            },
            cost: ability.costs.breakSelf(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: card => this.game.currentConflict.isAttacking(card)
            },
            message: '{0} breaks {1}, forcing {2} to discard {3}',
            messageItems: context => [context.player.opponent]
        });
    }
}

EndlessPlains.id = 'endless-plains';

module.exports = EndlessPlains;

