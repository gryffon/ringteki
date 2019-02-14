const DrawCard = require('../../drawcard.js');

class GuardianOfVirtue extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending() && context.player.hasComposure(),
            effect: ability.effects.doesNotBow()
        });
    }
}

GuardianOfVirtue.id = 'guardian-of-virtue';

module.exports = GuardianOfVirtue;
