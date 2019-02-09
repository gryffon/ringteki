const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants');

class RestoredHeirloom extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Put into play',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'water' && event.player === context.player
            },
            effect: 'attach {1} to {0} instead of resolving the {2}',
            effectArgs: context => [context.source, context.event.ring],
            location: [Locations.Hand,Locations.ConflictDiscardPile],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cancel(context => ({
                    replacementGameAction: AbilityDsl.actions.attach({ attachment: context.source })
                }))
            }
        });
    }
}

RestoredHeirloom.id = 'restored-heirloom';

module.exports = RestoredHeirloom;
