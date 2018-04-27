const DrawCard = require('../../drawcard.js');

class ForGreaterGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a fate on all your bushi in this conflict',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictType === 'military' && context.player.anyCardsInPlay(card => (
                    card.isAttacking() && card.hasTrait('bushi') && card.allowGameAction('placeFate', context)
                ))
            },
            max: ability.limit.perConflict(1),
            effect: 'add a fate to each of their participating Bushi',
            handler: context => {
                let cards = context.event.conflict.attackers.filter(card => card.hasTrait('bushi'));
                this.game.applyGameAction(context, { placeFate: cards });
            }
        });
    }
}

ForGreaterGlory.id = 'for-greater-glory';

module.exports = ForGreaterGlory;
