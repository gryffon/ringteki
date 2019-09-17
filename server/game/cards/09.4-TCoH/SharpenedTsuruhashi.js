import { Locations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SharpenedTsuruhashi extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Return Sharpened Tsuruhashi to your hand',
            when: {
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                destination: Locations.Hand,
                target: context.source
            })),
            effect: 'it to their hand.'
        });
    }
}

SharpenedTsuruhashi.id = 'sharpened-tsuruhashi';

module.exports = SharpenedTsuruhashi;

