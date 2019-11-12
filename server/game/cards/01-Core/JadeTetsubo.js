const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class JadeTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Return all fate from a character',
            cost: ability.costs.bowSelf(),
            condition: context => context.source.parent.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.militarySkill < context.source.parent.militarySkill,
                gameAction: ability.actions.removeFate(context => ({
                    amount: context.target.fate,
                    recipient: context.target.owner
                }))
            },
            effect: 'return all fate from {0} to its owner'
        });
    }
}

JadeTetsubo.id = 'jade-tetsubo';

module.exports = JadeTetsubo;
