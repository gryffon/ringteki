const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class KaitoTempleProtector extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: ability.effects.cardCannot({
                cannot: 'sendHome',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action({
            title: 'Change base skills to match another character\'s',
            condition: context => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: ability.actions.cardLastingEffect(context => {
                    let effects = [];
                    if(context.target.hasDash('military')) {
                        effects.push(ability.effects.setBaseDash('military'));
                    } else {
                        effects.push(ability.effects.setBaseMilitarySkill(context.target.militarySkill));
                    }
                    if(context.target.hasDash('political')) {
                        effects.push(ability.effects.setBaseDash('political'));
                    } else {
                        effects.push(ability.effects.setBasePoliticalSkill(context.target.politicalSkill));
                    }
                    return {
                        target: context.source,
                        effect: effects
                    };
                })
            },
            effect: 'change his base skills to equal {0}\'s current skills'
        });
    }
}

KaitoTempleProtector.id = 'kaito-temple-protector';

module.exports = KaitoTempleProtector;
