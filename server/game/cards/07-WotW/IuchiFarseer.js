const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations, Players } = require('../../Constants');

class IuchiFarseer extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal an opponent\'s province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: ability.actions.reveal()
            },
            effect: 'reveal {0}'
        });
    }
}

IuchiFarseer.id = 'iuchi-farseer';

module.exports = IuchiFarseer;
