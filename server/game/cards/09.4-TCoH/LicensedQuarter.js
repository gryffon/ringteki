const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class LicensedQuarter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard the top card of your opponents conflict deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            effect: 'discard the top card of {1}\'s conflict deck',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent && context.player.opponent.conflictDeck.first()
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}

LicensedQuarter.id = 'licensed-quarter';

module.exports = LicensedQuarter;

