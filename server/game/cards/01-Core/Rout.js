const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class Rout extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('bushi') && myCard.isParticipating() &&
                    myCard.militarySkill > card.militarySkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

Rout.id = 'rout';

module.exports = Rout;
