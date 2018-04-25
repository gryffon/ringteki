const ProvinceCard = require('../../provincecard.js');

class ElementalFury extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the contested ring',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source
            },
            target: {
                ringCondition: ring => ring.isUnclaimed(),
                mode: 'ring'
            },
            message: '{0} uses {1} to change the ring to {2}',
            handler: context => this.game.currentConflict.switchElement(context.ring.element)
        });
    }
}

ElementalFury.id = 'elemental-fury';

module.exports = ElementalFury;
