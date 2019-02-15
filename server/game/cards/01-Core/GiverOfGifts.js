const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class GiverOfGifts extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: ability.actions.selectCard(context => ({
                    controller: Players.Self,
                    cardCondition: card => card !== context.target.parent,
                    message: '{0} moves {1} to {2}',
                    messageArgs: card => [context.player, context.target, card],
                    gameAction: ability.actions.attach({ attachment: context.target })
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
