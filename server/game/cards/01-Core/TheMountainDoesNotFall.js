const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');

class TheMountainDoesNotFall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Choose a character to not bow when defending',
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    condition: () => context.target.isDefending(),
                    effect: ability.effects.doesNotBow()
                }))
            },
            effect: 'make {0} not bow as a defender',
            max: ability.limit.perRound(1)
        });
    }
}

TheMountainDoesNotFall.id = 'the-mountain-does-not-fall';

module.exports = TheMountainDoesNotFall;
