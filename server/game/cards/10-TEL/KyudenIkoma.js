const AbilityDsl = require('../../abilitydsl.js');

const StrongholdCard = require('../../strongholdcard.js');

class KyudenIkoma extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow a non-champion',
            cost: ability.costs.bowSelf(),
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player
                    && event.conflict.defendingPlayer !== context.player
                    && event.conflict.attackers && event.conflict.attackers.length !== 0
            },
            target: {
                cardCondition: card => !card.hasTrait('champion'),
                activePromptTitle: 'Bow a non-champion',
                gameAction: AbilityDsl.actions.bow()
            },
            effect: 'bow {0}.'
        });
    }
}

KyudenIkoma.id = 'kyuden-ikoma';

module.exports = KyudenIkoma;
