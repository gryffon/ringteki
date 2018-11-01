const DrawCard = require('../../drawcard.js');

class MeishodoWielder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: context => this.game.getFirstPlayer() === context.player,
            effect: ability.effects.reduceCost({
                playingTypes: 'playFromProvince', match: (card, source) => card === source
            })
        });
    }
}

MeishodoWielder.id = 'meishodo-wielder';

module.exports = MeishodoWielder;
