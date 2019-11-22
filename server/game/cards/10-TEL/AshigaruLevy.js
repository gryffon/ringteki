import { Locations, CardTypes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AshigaruLevy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Release the levies!',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.DynastyDiscardPile],
                cardCondition: (card, context) => card.owner === context.player
                    && card.id === 'ashigaru-levy',
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            effect: 'to put {0} into play.'
        });
    }
}

AshigaruLevy.id = 'ashigaru-levy';

module.exports = AshigaruLevy;

