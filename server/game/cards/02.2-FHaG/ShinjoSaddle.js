const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class ShinjoSaddle extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move to another character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.attach(context => ({ attachment: context.source }))
            }
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player || !card.hasTrait('cavalry')) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

ShinjoSaddle.id = 'shinjo-saddle';

module.exports = ShinjoSaddle;
