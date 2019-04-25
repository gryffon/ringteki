const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class MarketOfKazeNoKami extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.isHonored,
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

MarketOfKazeNoKami.id = 'market-of-kaze-no-kami';

module.exports = MarketOfKazeNoKami;
