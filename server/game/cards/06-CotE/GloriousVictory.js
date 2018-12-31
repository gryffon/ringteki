const DrawCard = require('../../drawcard.js');

class GloriousVictory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event, context) => this.game.isDuringConflict('military') && event.conflict.attackingPlayer === context.player
            },
            gameAction: ability.actions.honor(context => ({
                target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character && card.controller === context.player)
            }))
        });
    }
}

GloriousVictory.id = 'glorious-victory';

module.exports = GloriousVictory;
