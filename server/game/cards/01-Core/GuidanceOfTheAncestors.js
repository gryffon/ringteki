const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class GuidanceOfTheAncestors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play this from the discard pile',
            location: Locations.ConflictDiscardPile,
            gameAction: ability.actions.playCard()
        });
    }
}

GuidanceOfTheAncestors.id = 'guidance-of-the-ancestors';

module.exports = GuidanceOfTheAncestors;
