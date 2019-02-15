const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes } = require('../../Constants');

class YogoKikuyo extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a spell',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    this.game.isDuringConflict() && event.card.type === CardTypes.Event &&
                    event.card.hasTrait('spell') && event.card.controller === context.player.opponent
            },
            cost: AbilityDsl.costs.putSelfIntoPlay(),
            location: Locations.Hand,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

YogoKikuyo.id = 'yogo-kikuyo';

module.exports = YogoKikuyo;
