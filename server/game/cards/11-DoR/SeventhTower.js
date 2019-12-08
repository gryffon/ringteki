const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class SeventhTower extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => {
                    let cards = context.player.getDynastyCardsInProvince(event.conflict.conflictProvince.location);
                    return cards.some((card) => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'))
                            && context.player.isDefendingPlayer() && event.conflict.winner === context.player;
                }
            },
            gameAction: AbilityDsl.actions.resolveConflictRing()
        });
    }
}

SeventhTower.id = 'seventh-tower';

module.exports = SeventhTower;
