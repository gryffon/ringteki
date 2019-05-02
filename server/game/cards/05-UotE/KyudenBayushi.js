const StrongholdCard = require('../../strongholdcard.js');
const { Durations, Players, CardTypes } = require('../../Constants');

class KyudenBayushi extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a dishonored character',
            cost: ability.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isDishonored,
                gameAction: [
                    ability.actions.ready(),
                    ability.actions.cardLastingEffect(context => ({
                        target: context.player.honor <= 6 ? context.target : [],
                        duration: Durations.UntilEndOfPhase,
                        effect: ability.effects.modifyBothSkills(1)
                    }))
                ]
            },
            effect: 'ready {1}{2}',
            effectArgs: context => [context.target, context.player.honor <= 6 ? ' and give it +1/+1 until the end of the phase' : '']
        });
    }
}

KyudenBayushi.id = 'kyuden-bayushi';

module.exports = KyudenBayushi;
