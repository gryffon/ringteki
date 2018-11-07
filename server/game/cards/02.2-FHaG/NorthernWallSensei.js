const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class NorthernWallSensei extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant immunity to events',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0,
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.immunity({ restricts: 'events' })
                })
            },
            effect: 'grant immunity to events to {0}'
        });
    }
}

NorthernWallSensei.id = 'northern-wall-sensei';

module.exports = NorthernWallSensei;
