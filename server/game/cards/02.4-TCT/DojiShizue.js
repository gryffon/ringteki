const DrawCard = require('../../drawcard.js');

class DojiShizue extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => this.game.currentPhase === 'fate' && context.player.imperialFavor !== '',
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

DojiShizue.id = 'doji-shizue';

module.exports = DojiShizue;
