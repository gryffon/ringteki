const DrawCard = require('../../drawcard.js');

class BentensTouch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Honor a character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bow(card => card.isFaction('phoenix') && card.hasTrait('shugenja')),
            target: {
                cardType: 'character',
                activePromptTitle: 'Choose a character to honor',
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player,
                gameAction: ability.actions.honor()
            }
        });
    }
}

BentensTouch.id = 'benten-s-touch';

module.exports = BentensTouch;
