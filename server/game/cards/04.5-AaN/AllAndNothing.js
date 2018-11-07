const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');

class AllAndNothing extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Replace a void effect with another ring effect',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'void' && event.player === context.player
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: (ring, context) => context.event.physicalRing ? ring !== context.event.physicalRing : ring.element !== 'void'
            },
            effect: 'resolve {0} effect instead of the void effect',
            handler: context => {
                let event = ability.actions.resolveRingEffect({ optional: context.event.optional, physicalRing: context.ring }).getEvent(context.ring, context);
                context.event.window.addEvent(event);
                this.game.openThenEventWindow(ability.actions.draw().getEvent(context.player, context));
                context.cancel();
            }
        });
    }
}

AllAndNothing.id = 'all-and-nothing'; // This is a guess at what the id might be - please check it!!!

module.exports = AllAndNothing;
