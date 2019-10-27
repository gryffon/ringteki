const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class MeishodoWielder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            condition: context => this.game.getFirstPlayer() === context.player,
            effect: ability.effects.reduceCost({
                match: (card, source) => card === source
            })
        });
    }
}

MeishodoWielder.id = 'meishodo-wielder';

module.exports = MeishodoWielder;
