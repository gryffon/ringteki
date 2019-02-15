const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class JewelOfTheKhamasin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce province strength',
            condition: context => context.source.parent.isAttacking() && this.game.currentConflict.conflictProvince.getStrength() > 0,
            cost: ability.costs.payHonor(1),
            limit: ability.limit.unlimitedPerConflict(),
            gameAction: ability.actions.cardLastingEffect(() => ({
                targetLocation: Locations.Provinces,
                target: this.game.currentConflict.conflictProvince,
                effect: ability.effects.modifyProvinceStrength(-1)
            })),
            effect: 'reduce the attacked province strength by 1'
        });
    }
}

JewelOfTheKhamasin.id = 'jewel-of-the-khamasin';

module.exports = JewelOfTheKhamasin;
