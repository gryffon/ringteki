const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class BentensTouch extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Honor a character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('phoenix') && card.hasTrait('shugenja')
            }),
            target: {
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.honor()
            }
        });
    }
}

BentensTouch.id = 'benten-s-touch';

module.exports = BentensTouch;
