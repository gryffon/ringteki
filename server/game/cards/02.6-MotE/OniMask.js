const DrawCard = require('../../drawcard.js');

class OniMask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank participating character',
            cost: ability.costs.discardFate(card => card === this.parent),
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} removes 1 fate from {1} to use {2} to blank {3} until the end of the conflict', this.controller, this.parent, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.blank
                }));
            }
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

OniMask.id = 'oni-mask'; // This is a guess at what the id might be - please check it!!!

module.exports = OniMask;
