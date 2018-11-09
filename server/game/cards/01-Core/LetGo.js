const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class LetGo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardTypes.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

LetGo.id = 'let-go';

module.exports = LetGo;


