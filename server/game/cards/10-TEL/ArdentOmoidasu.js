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
                    const dishonoredCharacterBelongsToOmoidasuOwner = targetIsControlledByPlayer(event.context.target, context);
                    return dishonoredCharacterBelongsToOmoidasuOwner &&
                        dishonoredByOpponentsEffect &&
                        (dishonoredByRingEffect || dishonoredByCardEffect);
                }
            },
            gameAction: AbilityDsl.actions.takeHonor({
                amount: 2
            })
        });
    }
}

function targetIsControlledByPlayer(target, context) {
    if(Array.isArray(target)) {
        return target.some(target => target.controller === context.player);
    }

    return target.controller === context.player;
}

ArdentOmoidasu.id = 'ardent-omoidasu';

module.exports = ArdentOmoidasu;
