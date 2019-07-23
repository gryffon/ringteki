const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class WritOfAuthority extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: context => context.player.opponent && context.player.opponent.honor > context.player.honor,
                message: '{0} is discarded from play as its controller has less honor',
                messageArgs: context => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }
}

WritOfAuthority.id = 'writ-of-authority';

module.exports = WritOfAuthority;
