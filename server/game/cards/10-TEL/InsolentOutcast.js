const DrawCard = require('../../drawcard.js');

class InsolentOutcast extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills((card, context) => this.getNoOfHonoredCharacters(context.player.opponent))
        });
    }

    getNoOfHonoredCharacters(player) {
        return player.cardsInPlay.filter(card => card.getType() === 'character' && card.isHonored).length;
    }
}

InsolentOutcast.id = 'insolent-outcast';

module.exports = InsolentOutcast;
