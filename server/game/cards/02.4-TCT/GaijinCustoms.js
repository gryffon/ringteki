const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class GaijinCustoms extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a non-unicorn character',
            condition: context => context.player.anyCardsInPlay(card => card.isFaction('unicorn')) || context.player.stronghold.isFaction('unicorn'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.isFaction('unicorn'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

GaijinCustoms.id = 'gaijin-customs';

module.exports = GaijinCustoms;
