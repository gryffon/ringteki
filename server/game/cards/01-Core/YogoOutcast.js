const DrawCard = require('../../drawcard.js');

class YogoOutcast extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => this.isLessHonorableThanOpponent(context.player),
            effect: ability.effects.modifyBothSkills(1)
        });
    }

    isLessHonorableThanOpponent(player) {
        let otherPlayer = this.game.getOtherPlayer(player);
        if(otherPlayer && otherPlayer.honor > player.honor) {
            return true;
        }
        return false;
    }
}

YogoOutcast.id = 'yogo-outcast';

module.exports = YogoOutcast;

