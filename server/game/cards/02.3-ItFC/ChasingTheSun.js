const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, EventNames } = require('../../Constants');

class ChasingTheSun extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player.isAttackingPlayer(),
            cannotBeMirrored: true,
            effect: 'move the conflict to a different province',
            handler: context => this.game.promptForSelect(context.player, {
                context: context,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => !card.isConflictProvince() && card.canBeAttacked(),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {1}', player, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        card.facedown = false;
                        this.game.raiseEvent(EventNames.OnCardRevealed, { context: context, card: card });
                    }
                    return true;
                }
            })
        });
    }
}

ChasingTheSun.id = 'chasing-the-sun';

module.exports = ChasingTheSun;
