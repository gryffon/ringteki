const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PalaceGuard extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.opponent.honor < context.player.honor,
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
    }
}

PalaceGuard.id = 'palace-guard';

module.exports = PalaceGuard;
