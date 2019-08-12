const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ShosuroIbuki extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove one fate from each other participating character',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.removeFate(context => ({
                target: context.game.currentConflict.getParticipants(participant => participant.uuid != context.source.uuid),
                amount: 1
            })),
            effect: 'remove one fate from each other participating character'
        });
    }
}

ShosuroIbuki.id = 'shosuro-ibuki';

module.exports = ShosuroIbuki;
