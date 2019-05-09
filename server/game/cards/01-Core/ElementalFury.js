const ProvinceCard = require('../../provincecard.js');
const AbiltyDsl = require('../../abilitydsl');

class ElementalFury extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the contested ring',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            gameAction: AbiltyDsl.actions.selectRing({
                message: '{0} switches the contested ring with {1}',
                messageArgs: (ring, player) => [player, ring],
                gameAction: AbiltyDsl.actions.switchConflictElement()
            }),
            effect: 'switch the contested ring with an unclaimed one'
        });
    }
}

ElementalFury.id = 'elemental-fury';

module.exports = ElementalFury;
