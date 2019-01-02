const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class GloriousVictory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event, context) => this.game.isDuringConflict('military') && event.conflict.attackingPlayer === context.player
            },
            gameAction: ability.actions.honor(context => ({
                target: context.player.filterCardsInPlay(card => card.getType() === CardTypes.Character)
            }))
        });
    }
}

GloriousVictory.id = 'glorious-victory';

module.exports = GloriousVictory;
