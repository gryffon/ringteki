const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ArdentOmoidasu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Steal 2 honor',
            when: {
                onCardDishonored: (event, context) => {
                    const dishonoredByOpponentsEffect = (context.player.opponent === event.context.player);
                    const dishonoredByRingEffect = (event.context.source.type === 'ring');
                    const dishonoredByCardEffect = event.context.ability.isCardAbility();
                    return dishonoredByOpponentsEffect && (dishonoredByRingEffect || dishonoredByCardEffect);
                }
            },
            gameAction: AbilityDsl.actions.takeHonor({
                amount: 2
            })
        });
    }
}

ArdentOmoidasu.id = 'ardent-omoidasu';

module.exports = ArdentOmoidasu;
