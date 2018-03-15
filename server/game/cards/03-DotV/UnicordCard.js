const DrawCard = require('../../drawcard.js');

class UnicordCard extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move highest glory character home',
            condition: context => context.source.isParticipating() && context.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: (card, context) => {
                    let participants = context.game.currentConflict.attacker.concat(context.game.currenctConflict.defenders);
                    return participants.includes(card) && card.getGlory() === Math.max(_.map(participants, c => c.getGlory()));
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', context.player, context.source, context.target);
                this.game.applyGameAction(context, { sendHome: context.target });
            }
        });
    }
}

UnicordCard.id = 'unicord-card'; // This is a guess at what the id might be - please check it!!!

module.exports = UnicordCard;
