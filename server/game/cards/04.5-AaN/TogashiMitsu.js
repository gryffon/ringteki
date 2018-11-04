const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class TogashiMitsu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a monk, kiho or tattoo card from discard',
            condition: context => context.source.isParticipating(),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: 'self',
                cardCondition: card => card.hasTrait('monk') || card.hasTrait('kiho') || card.hasTrait('tattoo'),
                gameAction: ability.actions.playCard({
                    postHandler: card => {
                        if(card.type === 'event') {
                            this.game.addMessage('{0} is placed on the bottom of {1}\'s deck', card, card.owner);
                            card.owner.moveCard(card, Locations.ConflictDeck, { bottom: true });
                        }
                    }
                })
            }
        });
    }
}

TogashiMitsu.id = 'togashi-mitsu';

module.exports = TogashiMitsu;
