const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class AllAndNothing extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Replace a void effect with another ring effect',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'void' && event.player === context.player
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: (ring, context) => context.event.physicalRing ? ring !== context.event.physicalRing : ring.element !== 'void',
                gameAction: AbilityDsl.actions.cancel(context => ({
                    replacementGameAction: AbilityDsl.actions.resolveRingEffect({
                        optional: context.event.optional,
                        physicalRing: context.ring
                    })
                }))
            },
            effect: 'resolve {0} effect instead of the void effect',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

AllAndNothing.id = 'all-and-nothing'; // This is a guess at what the id might be - please check it!!!

module.exports = AllAndNothing;
