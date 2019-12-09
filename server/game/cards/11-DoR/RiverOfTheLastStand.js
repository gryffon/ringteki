const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes } = require('../../Constants');

class RiverOfTheLastStand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make opponent discard two cards and draw a card',
            condition: context => {
                if(context.player.isDefendingPlayer()) {
                    let cards = context.player.getDynastyCardsInProvince(this.game.currentConflict.conflictProvince.location);
                    return cards.some(card => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
                return false;
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            ])
        });
    }
}

RiverOfTheLastStand.id = 'river-of-the-last-stand';

module.exports = RiverOfTheLastStand;
