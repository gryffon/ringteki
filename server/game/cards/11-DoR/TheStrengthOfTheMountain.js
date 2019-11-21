const DrawCard = require('../../drawcard.js');

class TheStrengthOfTheMountain extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Defending characters do not bow',
            condition: () => this.game.isDuringConflict(),
            effect: 'prevent defending characters from bowing or returning home while defending',
            gameAction: [
                ability.actions.cardLastingEffect(context => ({
                    target: context.player.cardsInPlay.filter(card => card.isDefending()),
                    effect: ability.effects.doesNotBow()
                })),
                ability.actions.cardLastingEffect(context => ({
                    target: context.player.cardsInPlay.filter(card => card.isDefending()),
                    effect: ability.effects.cardCannot({
                        cannot: 'returnHome'
                    })
                }))
            ]
        });
    }
}

TheStrengthOfTheMountain.id = 'the-strength-of-the-mountain';

module.exports = TheStrengthOfTheMountain;
