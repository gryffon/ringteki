const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class SpreadingTheDarkness extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +4/+0',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(2),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.modifyMilitarySkill(4),
                        ability.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardEffects'
                        })
                    ]
                })
            },
            effect: 'give {0} +4{1} and prevent them from being targeted by opponent\'s abilities',
            effectArgs: () => 'military'
        });
    }
}

SpreadingTheDarkness.id = 'spreading-the-darkness'; // This is a guess at what the id might be - please check it!!!

module.exports = SpreadingTheDarkness;
