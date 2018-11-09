const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class IsawaUona extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow a non-unique character in the conflict',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('air') && this.game.isDuringConflict()
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && !card.isUnique(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

IsawaUona.id = 'isawa-uona';

module.exports = IsawaUona;
