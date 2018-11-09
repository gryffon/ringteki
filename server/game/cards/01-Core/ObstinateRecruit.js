const DrawCard = require('../../drawcard.js');

class ObstinateRecruit extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition:  context => context.player.opponent && context.player.opponent.honor > context.player.honor,
                message: '{0} is discarded from play as its controller has less honor',
                gameAction: ability.actions.discardFromPlay()
            })
        });
    }
}

ObstinateRecruit.id = 'obstinate-recruit';

module.exports = ObstinateRecruit;
