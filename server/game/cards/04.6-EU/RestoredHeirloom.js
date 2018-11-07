const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class RestoredHeirloom extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Put into play',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'water' && event.player === context.player
            },
            effect: 'replace the water ring with putting Restored Heirloom into play',
            location: [Locations.Hand,Locations.ConflictDiscardPile],
            target: {
                cardType: 'character',
                controller: Players.Self
            },
            handler: context => {
                context.cancel();
                let event = ability.actions.attach({ attachment: context.source }).getEvent(context.target, context);
                context.event.window.addEvent(event);
            }
        });
    }
}

RestoredHeirloom.id = 'restored-heirloom';

module.exports = RestoredHeirloom;
