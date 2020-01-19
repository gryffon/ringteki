const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TheStrengthOfTheMountain extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Defending characters do not bow',
            condition: () => this.game.isDuringConflict(),
            gameAction: [
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.defenders,
                    effect: AbilityDsl.effects.doesNotBow()
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.defenders,
                    effect: [
                        AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects'
                        }),
                        AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    ]
                }))
            ],
            effect: 'prevent opponents\' actions from bowing or moving home defending characters, and stop them bowing at the end of a the conflict'
        });
    }
}

TheStrengthOfTheMountain.id = 'the-strength-of-the-mountain';

module.exports = TheStrengthOfTheMountain;
