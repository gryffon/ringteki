const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class AncestralArmory extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return a weapon attachment in your conflict discard pile to your hand',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a weapon attachment from your conflict discard pile',
                cardCondition: card => card.hasTrait('weapon'),
                location: [Locations.ConflictDiscardPile],
                controller: Players.Self,
                gameAction: ability.actions.moveCard({ destination: Locations.Hand })
            }
        });
    }
}

AncestralArmory.id = 'ancestral-armory';

module.exports = AncestralArmory;
