import { Players } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class StewardOfTheRichFrog extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player && context.player.opponent &&
            context.player.hand.size() < context.player.opponent.hand.size(),
            targetController: Players.Self,
            match: card => card.getType() === CardTypes.Character,
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });
    }
}

StewardOfTheRichFrog.id = 'steward-of-the-rich-frog';

module.exports = StewardOfTheRichFrog;
