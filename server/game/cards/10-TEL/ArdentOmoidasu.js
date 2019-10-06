const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ArdentOmoidasu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Steal 2 honor',
            when: {
                onCardDishonored: (event, context) => event.card.controller === context.player
                    && event.context.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.takeHonor({
                amount: 2
            })
        });
    }
}

ArdentOmoidasu.id = 'ardent-omoidasu';

module.exports = ArdentOmoidasu;
