const DrawCard = require('../../drawcard.js');

class MeishodoWielder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.getFirstPlayer() === this.controller,
            effect: ability.effects.reduceCost({ playingTypes: 'playFromProvince', match: card => card === this })
        });
    }
}

MeishodoWielder.id = 'meishodo-wielder';

module.exports = MeishodoWielder;
