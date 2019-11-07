const ProvinceCard = require('../../provincecard.js');
const { Locations, CardTypes } = require('../../Constants');

class BorderFortress extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal a province',
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.facedown,
                gameAction: ability.actions.reveal({ chatMessage: true })
            },
            effect: 'reveal {1}\'s facedown province in their {2}',
            effectArgs: context => [context.target.controller, context.target.location]
        });
    }
}

BorderFortress.id = 'border-fortress'; // This is a guess at what the id might be - please check it!!!

module.exports = BorderFortress;
