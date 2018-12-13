const ProvinceCard = require('../../provincecard.js');
const { TargetModes } = require('../../Constants');

class ElementalFury extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the contested ring',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            target: {
                ringCondition: ring => ring.isUnclaimed(),
                mode: TargetModes.Ring
            },
            effect: 'change the conflict ring to {0}',
            handler: context => this.game.currentConflict.switchElement(context.ring.element)
        });
    }
}

ElementalFury.id = 'elemental-fury';

module.exports = ElementalFury;
