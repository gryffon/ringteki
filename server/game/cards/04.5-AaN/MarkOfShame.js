const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MarkOfShame extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor attached character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parent })),
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parent }))
            ]),
            effect: 'dishonor {1}, then dishonor it again',
            effectArgs: context => context.source.parent
        });
    }
}

MarkOfShame.id = 'mark-of-shame';

module.exports = MarkOfShame;
