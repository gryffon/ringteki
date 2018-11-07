const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');

class DojiShizue extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => this.game.currentPhase === Phases.Fate && context.player.imperialFavor !== '',
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

DojiShizue.id = 'doji-shizue';

module.exports = DojiShizue;
