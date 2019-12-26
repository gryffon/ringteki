const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class InvocationOfAsh extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move to another character',
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.attach(context => ({ attachment: context.source })),
                    AbilityDsl.actions.removeFate()
                ])
            },
            effect: 'move {1} to {0}, then remove a fate from {0}',
            effectArgs: context => context.source
        });
    }
}

InvocationOfAsh.id = 'invocation-of-ash';

module.exports = InvocationOfAsh;
