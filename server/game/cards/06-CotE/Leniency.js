const DrawCard = require('../../drawcard.js');
const { Players, Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class Leniency extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Put a two cost or lower character into play into play instead of resolving the ring effects',
            when: {
                onResolveRingElement: (event, context) => event.player === context.player
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            effect: 'put {0} into play instead of resolving the ring effect',
            handler: event => {
                event.cancel();
            }
        });
    }
}

Leniency.id = 'leniency';

module.exports = Leniency;
