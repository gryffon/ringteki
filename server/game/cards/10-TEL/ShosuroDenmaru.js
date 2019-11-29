import { Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ShosuroDenmaru extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            match: card => card.isHonored,
            effect: AbilityDsl.effects.setBaseGlory(0)
        });
    }
}

ShosuroDenmaru.id = 'shosuro-denmaru';

module.exports = ShosuroDenmaru;
