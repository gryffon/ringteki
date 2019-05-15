const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IronMine extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardTypes.Character
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.joint([
                AbilityDsl.actions.sacrifice(context => ({ target: context.source })),
                AbilityDsl.actions.cancel()
            ])
        });
    }
}

IronMine.id = 'iron-mine';

module.exports = IronMine;
