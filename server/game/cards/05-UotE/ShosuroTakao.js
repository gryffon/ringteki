const DrawCard = require('../../drawcard.js');

class ShosuroTakao extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character into or out of the conflict',
            condition: context => (context.player.anyCardsInPlay(card => card.isParticipating() && card.isDishonored)) ||
            (context.player.opponent.anyCardsInPlay(card => card.isParticipating() && card.isDishonored)),
            gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
        });
    }
}

ShosuroTakao.id = 'shosuro-takao';

module.exports = ShosuroTakao;
