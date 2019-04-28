const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants');

class BenevolentHost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a Courtier into play',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('courtier'),
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            then: context => ({
                gameAction: AbilityDsl.actions.placeFate({ target: context.target.costLessThan(3) ? context.target : [] })
            })
        });
    }
}

BenevolentHost.id = 'benevolent-host';

module.exports = BenevolentHost;
