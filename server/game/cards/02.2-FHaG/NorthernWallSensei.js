const DrawCard = require('../../drawcard.js');

class NorthernWallSensei extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant immunity to events',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player && card.attachments.size() > 0
            },
            effect: 'grant immunity to events to {0}',
            untilEndOfConflict: {
                effect: ability.effects.immuneTo(context => context.source.type === 'event')
            }
        });
    }
}

NorthernWallSensei.id = 'northern-wall-sensei';

module.exports = NorthernWallSensei;
