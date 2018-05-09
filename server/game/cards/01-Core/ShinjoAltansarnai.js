const DrawCard = require('../../drawcard.js');

class ShinjoAltansarnai extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                onBreakProvince: (event, context) => event.conflict.conflictType === 'military' && context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                player: 'opponent',
                cardCondition: (card, context) => card.controller === context.player.opponent,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

ShinjoAltansarnai.id = 'shinjo-altansarnai';

module.exports = ShinjoAltansarnai;
