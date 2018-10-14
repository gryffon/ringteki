const DrawCard = require('../../drawcard.js');

class SoshiAoi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +1/+0 and the Bushi trait or +0/+1 and the Courtier trait',
            cost: ability.costs.payHonor(1),
            targets: {
                character: {
                    cardType: 'character',
                    controller: 'self'
                },
                select: {
                    mode: 'select',
                    dependsOn: 'character',
                    choices: {
                        'Give +1/+0 and the Bushi trait': ability.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            duration: 'untilEndOfPhase',
                            effect: [ability.effects.modifyMilitarySkill(1),
                                ability.effects.addTrait('bushi')]
                        })),
                        'Give +0/+1 and the Courtier trait': ability.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            duration: 'untilEndOfPhase',
                            effect: [ability.effects.modifyPoliticalSkill(1),
                                ability.effects.addTrait('courtier')]
                        }))
                    }
                }
            },
            effect: '{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'Give +1/+0 and the Bushi trait') {
                    return ['give +1/+0 and the bushi trait to ', context.targets.character];
                }
                return ['give +0/+1 and the courtier trait to ', context.targets.character];
            }
        });
    }
}

SoshiAoi.id = 'soshi-aoi';

module.exports = SoshiAoi;
