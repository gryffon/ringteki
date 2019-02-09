const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class Unmask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a character\'s status token and set its skills to its printed value until the conflicts end. Controller gains 2 honor.',
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.multiple([
                    ability.actions.discardStatusToken(),
                    ability.actions.cardLastingEffect(context => ({
                        effect: [
                            ability.effects.setMilitarySkill(context.target.getBaseMilitarySkill()),
                            ability.effects.setPoliticalSkill(context.target.getBasePoliticalSkill())
                        ]
                    })),
                    ability.actions.gainHonor(context => ({ amount: 2, target: context.target.controller }))
                ])
            }
        });
    }
}

Unmask.id = 'unmask';

module.exports = Unmask;
