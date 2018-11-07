const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Flip a card faceup',
            target: {
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: card => card.isDynasty && card.facedown,
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
