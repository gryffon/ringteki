const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class CavalryReserves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put Cavalry into play from your discard',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                multiSelect: true,
                cardType: 'character',
                cardCondition: card => {
                    return (card.hasTrait('cavalry') && !card.facedown &&
                            card.location === 'dynasty discard pile' &&
                            this.controller.canPutIntoPlay(card, true));
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, putting {2} into the conflict', this.controller, this, context.target);
                _.each(context.target, card => this.controller.putIntoPlay(card, true));
            }
        });
    }
}

CavalryReserves.id = 'cavalry-reserves';

module.exports = CavalryReserves;
