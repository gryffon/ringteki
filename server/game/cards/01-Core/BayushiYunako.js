const DrawCard = require('../../drawcard.js');

class BayushiYunako extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s M and P skill',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && !card.hasDash()
            },
            effect: 'switch {0}\'s military and political skill',
            handler: context => {
                let diff = context.target.baseMilitarySkill - context.target.basePoliticalSkill;
                context.source.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyBaseMilitarySkill(-diff),
                        ability.effects.modifyBasePoliticalSkill(diff)
                    ]
                }));
            }
        });
    }
}

BayushiYunako.id = 'bayushi-yunako';

module.exports = BayushiYunako;
