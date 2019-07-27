const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class KitsukiYuikimi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Cannot be targeted by opponent\'s triggered abilities',
            when: {
                onMoveFate: (event, context) => context.source.isParticipating() && event.origin.type === 'ring' && context.player.opponent
            },
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsTriggeredAbilities'
                })
            }),
            effect: 'prevent {0} from being chosen as the target of {1}\'s triggered abilities until the end of the conflict',
            effectArgs: context => [context.player.opponent]
        });
    }
}

KitsukiYuikimi.id = 'kitsuki-yuikimi';

module.exports = KitsukiYuikimi;
