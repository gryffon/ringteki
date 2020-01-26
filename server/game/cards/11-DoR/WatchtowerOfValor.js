const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class WatchtowerOfValor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) => {
                    if(event && event.conflict && event.conflict.conflictProvince && event.conflict.conflictProvince.location) {
                        let cards = context.player.getDynastyCardsInProvince(event.conflict.conflictProvince.location);
                        return cards.some((card) => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'))
                                && context.player.isDefendingPlayer() && event.conflict.winner === context.player;
                    }
                    return false;
                }
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}

WatchtowerOfValor.id = 'watchtower-of-valor';

module.exports = WatchtowerOfValor;
