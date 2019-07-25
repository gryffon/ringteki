const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ObstinateRecruit extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => context.player.opponent && context.player.opponent.honor > context.player.honor,
                message: '{0} is discarded from play as its controller has less honor',
                messageArgs: context => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }
}

ObstinateRecruit.id = 'obstinate-recruit';

module.exports = ObstinateRecruit;
