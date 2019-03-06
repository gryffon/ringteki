const DrawCard = require('../../drawcard.js');

class UtakuBattleSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.honor(context => ({
                target: context.source.parent
            }))
        });
    }

    canAttach(card, context) {
        return card.isFaction('unicorn') && super.canAttach(card, context);
    }
}

UtakuBattleSteed.id = 'utaku-battle-steed';

module.exports = UtakuBattleSteed;
