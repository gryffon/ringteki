const DrawCard = require('../../drawcard.js');

class TheMountainDoesNotFall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Choose a character to not bow when defending',
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            effect: 'make {0} not bow as a defender',
            untilEndOfPhase: context => ({
                match: context.target,
                condition: () => context.target.isDefending(),
                effect: ability.effects.doesNotBow
            }),
            max: ability.limit.perRound(1)
        });
    }
}

TheMountainDoesNotFall.id = 'the-mountain-does-not-fall';

module.exports = TheMountainDoesNotFall;
