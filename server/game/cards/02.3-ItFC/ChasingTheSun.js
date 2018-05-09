const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ChasingTheSun extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player.isAttackingPlayer(),
            effect: 'move the conflict to a different province',
            handler: context => this.game.promptForSelect(context.player, {
                source: context.source,
                cardType: 'province',
                cardCondition: (card, context) => card.controller === context.player.opponent && !card.isConflictProvince() && (card.location !== 'stronghold province' ||
                                                  _.size(this.game.allCards.filter(card => card.isProvince && card.isBroken && card.controller === context.player.opponent)) > 2),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {}', player, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        card.facedown = false;
                        this.game.raiseEvent('onProvinceRevealed', { conflict: this.game.currentConflict, province: card });
                    }
                    return true;
                }
            })
        });
    }
}

ChasingTheSun.id = 'chasing-the-sun';

module.exports = ChasingTheSun;
