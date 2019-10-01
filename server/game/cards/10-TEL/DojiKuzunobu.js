import { Players } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class DojiKuzuNobu extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'triggerAbilities',
                restricts: 'reactions'
            })
        });
    }
}

DojiKuzuNobu.id = 'doji-kuzunobu';

module.exports = DojiKuzuNobu;
