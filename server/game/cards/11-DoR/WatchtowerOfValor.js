const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class WatchtowerOfValor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) => {
                    let cards = context.player.getDynastyCardsInProvince(event.conflict.conflictProvince.location);
                    return cards.some((card) => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'))
                            && context.player.isDefendingPlayer() && event.conflict.winner === context.player;
                }
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}

WatchtowerOfValor.id = 'watchtower-of-valor';

module.exports = WatchtowerOfValor;
