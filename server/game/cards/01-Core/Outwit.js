const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class Outwit extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('courtier') && myCard.isParticipating() &&
                    myCard.politicalSkill > card.politicalSkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

Outwit.id = 'outwit';

module.exports = Outwit;
