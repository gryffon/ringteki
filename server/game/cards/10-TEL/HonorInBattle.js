import { CardTypes, TargetModes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HonorInBattle extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: context =>
                Object.values(this.game.rings).some(
                    ring =>
                        ring.isConsideredClaimed(context.player) &&
                        ring.isConflictType('military')
                ),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

HonorInBattle.id = 'honor-in-battle';

module.exports = HonorInBattle;
