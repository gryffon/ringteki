const DrawCard = require('../../drawcard.js');

class OniMask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank participating character',
            cost: ability.costs.discardFateFromParent(),
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            effect: 'blank {0} until the end of the conflict',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.blank
            })
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

OniMask.id = 'oni-mask';

module.exports = OniMask;
