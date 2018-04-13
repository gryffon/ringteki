const DrawCard = require('../../drawcard.js');

class TheMountainDoesNotFall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Chooes a character to not bow when defending',
            max: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to make {2} not bow as a defender', this.controller, this, context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    condition: () => context.target.isDefending(),
                    effect: ability.effects.doesNotBow
                }));
            }
        });
    }
}

TheMountainDoesNotFall.id = 'the-mountain-does-not-fall';

module.exports = TheMountainDoesNotFall;
