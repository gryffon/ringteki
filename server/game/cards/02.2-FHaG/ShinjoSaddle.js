const DrawCard = require('../../drawcard.js');

class ShinjoSaddle extends DrawCard {
    setupCardAbilities(ability) {
        // AttachAction
        this.action({
            title: 'Move to another character',
            target: {
                cardType: 'character',
                gameAction: ability.actions.attach().options(context => ({ attachment: context.source }))
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
