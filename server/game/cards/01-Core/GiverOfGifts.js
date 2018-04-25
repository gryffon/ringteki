const DrawCard = require('../../drawcard.js');

class GiverOfGifts extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: 'attachment',
                cardCondition: (card, context) => card.controller === context.player && card.location === 'play area'
            },
            handler: context => this.game.promptForSelect(context.player, {
                source: context.source,
                cardType: 'character',
                cardCondition: card => context.player.canAttach(context.target, card) && card.controller === context.player && card !== context.target.parent,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1} to move {2} from {3} to {4}', player, context.source, context.target, context.target.parent, card);
                    player.attach(context.target, card);
                    return true;
                }
            })
        });
    }
}

GiverOfGifts.id = 'giver-of-gifts';

module.exports = GiverOfGifts;
