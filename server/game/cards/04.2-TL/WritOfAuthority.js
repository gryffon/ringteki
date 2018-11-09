const DrawCard = require('../../drawcard.js');

class WritOfAuthority extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: context => context.player.opponent && context.player.opponent.honor > context.player.honor,
                message: '{0} is discarded from play as its controller has less honor',
                gameAction: ability.actions.discardFromPlay()
            })
        });
    }
}

WritOfAuthority.id = 'writ-of-authority'; //double check this before PR

module.exports = WritOfAuthority;
