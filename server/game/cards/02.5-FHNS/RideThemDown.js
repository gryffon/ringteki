const DrawCard = require('../../drawcard.js');

class RideThemDown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce province strength',
            cost: ability.costs.discardImperialFavor(),
            condition: () => this.game.isDuringConflict(),
            effect: 'reduce the strength of {0} to 1',
            untilEndOfConflict: () => ({
                target: this.game.currentConflict.conflictProvince,
                effect: ability.effects.modifyProvinceStrength(this.game.currentConflict.conflictProvince.getBaseStrength() - 1)
            })
        });
    }
}

RideThemDown.id = 'ride-them-down';

module.exports = RideThemDown;
