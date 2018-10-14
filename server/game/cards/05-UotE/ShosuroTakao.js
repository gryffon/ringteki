const DrawCard = require('../../drawcard.js');

class ShosuroTakao extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character into or out of the conflict',
            condition: () => this.game.isDuringConflict() && this.game.currentConflict.getNumberOfParticipants(card => card.isDishonored) > 0,
            gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
        });
    }
}

ShosuroTakao.id = 'shosuro-takao';

module.exports = ShosuroTakao;
