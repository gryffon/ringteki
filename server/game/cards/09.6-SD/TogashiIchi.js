import { Locations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TogashiIchi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Break the province',
            condition: context => context.source.isAttacking() &&
                (this.game.currentConflict.getNumberOfCardsPlayed(context.player) + this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent)) >= 10 &&
                this.game.currentConflict.conflictProvince.location !== Locations.StrongholdProvince,
            gameAction: AbilityDsl.actions.break(context => ({
                target: context.game.currentConflict.conflictProvince
            }))
        });
    }
}

TogashiIchi.id = 'togashi-ichi';

module.exports = TogashiIchi;
