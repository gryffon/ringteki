const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class TogashiMitsu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a monk, kiho or tattoo card from discard',
            condition: context => context.source.isParticipating(),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('monk') || card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: ability.actions.playCard({
                    destination: Locations.ConflictDeck,
                    destinationOptions: { bottom: true }
                })
            }
        });
    }
}

TogashiMitsu.id = 'togashi-mitsu';

module.exports = TogashiMitsu;
