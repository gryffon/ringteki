const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');

class FloodedWaste extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow each attacking character',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character && card.isAttacking())
            }))
        });
    }
}

FloodedWaste.id = 'flooded-waste';

module.exports = FloodedWaste;
