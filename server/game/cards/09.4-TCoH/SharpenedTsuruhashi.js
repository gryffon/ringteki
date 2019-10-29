const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SharpenedTsuruhashi extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Return Sharpened Tsuruhashi to your hand',
            when: {
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.returnToHand(context => ({
                target: context.source
            })),
            effect: 'return it to their hand.'
        });
    }
}

SharpenedTsuruhashi.id = 'sharpened-tsuruhashi';

module.exports = SharpenedTsuruhashi;

