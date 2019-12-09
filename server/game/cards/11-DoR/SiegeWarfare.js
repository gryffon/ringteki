const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class SiegeWarfare extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give attacked province -2 strength',
            condition: context => context.player.isAttackingPlayer() && context.player.getNumberOfHoldingsInPlay() > 0 && this.game.currentConflict.conflictProvince.getStrength() > 0,
            gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                targetLocation: Locations.Provinces,
                target: this.game.currentConflict.conflictProvince,
                effect: AbilityDsl.effects.modifyProvinceStrength(-2)
            })),
            effect: 'reduce the province strength of {1} by 2',
            effectArgs: () => this.game.currentConflict.conflictProvince.name
        });
    }
}

SiegeWarfare.id = 'siege-warfare';

module.exports = SiegeWarfare;
