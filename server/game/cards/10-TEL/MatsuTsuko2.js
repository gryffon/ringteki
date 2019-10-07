import { Locations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MatsuTsuko2 extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Break the province',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
                    && context.source.isAttacking()
                    && event.conflict.conflictProvince.location !== Locations.StrongholdProvince
                    && context.player.opponent && context.player.getTotalHonor() > context.player.opponent.getTotalHonor()
            },
            gameAction: AbilityDsl.actions.break(context => ({
                target: context.game.currentConflict.conflictProvince
            }))
        });
    }
}

MatsuTsuko2.id = 'matsu-tsuko-2';

module.exports = MatsuTsuko2;
