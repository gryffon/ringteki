const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

class YogoKikuyo extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel a spell',
            when: {
                onCardAbilityInitiated: (event, context) => this.game.isDuringConflict() && event.card.type === CardTypes.Event &&
                                                            event.card.hasTrait('spell') &&
                                                            event.card.controller === context.player.opponent
            },
            cost: ability.costs.putSelfIntoPlay(),
            location: Locations.Hand,
            effect: 'cancel the effects of {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }
}

YogoKikuyo.id = 'yogo-kikuyo';

module.exports = YogoKikuyo;
