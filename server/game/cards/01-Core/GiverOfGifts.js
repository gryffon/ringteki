const DrawCard = require('../../drawcard.js');

class GiverOfGifts extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: 'attachment',
                cardCondition: (card, context) => card.controller === context.player && card.location === 'play area'
            },
            effect: 'move {0} to another character',
            gameAction: ability.actions.attach().options(context => ({ attachment: context.target })).promptForSelect(context => ({
                cardCondition: card => card.controller === context.player && card !== context.target.parent,
                message: '{0} moves {1} to {2}'
            }))
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
