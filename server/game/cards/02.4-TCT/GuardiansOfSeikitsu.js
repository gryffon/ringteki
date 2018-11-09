const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');

class GuardiansOfTheSeikitsu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: {
                onProvinceRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character && card.costLessThan(3))
            }))
        });
    }
}

GuardiansOfTheSeikitsu.id = 'guardians-of-the-seikitsu';

module.exports = GuardiansOfTheSeikitsu;
