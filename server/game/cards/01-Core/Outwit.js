const DrawCard = require('../../drawcard.js');

class Outwit extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: 'character', 
                cardCondition: (card, context) => card.controller !== context.player && context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('courtier') && myCard.politicalSkill > card.politicalSkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

Outwit.id = 'outwit';

module.exports = Outwit;
