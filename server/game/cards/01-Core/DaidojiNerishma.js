const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Flip a card faceup',
            target: {
                controller: 'self',
                location: Locations.Provinces,
                cardCondition: card => card.isDynasty && card.facedown,
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
