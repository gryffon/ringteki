const DrawCard = require('../../drawcard.js');

class WaningHostilities extends DrawCard {
    // TODO: refactor this
    setupCardAbilities() {
        this.reaction({
            title: 'Both players may only declare 1 conflict opportunity this turn',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            effect: 'limit both players to a single conflict this turn',
            handler: context => {
                context.player.conflictOpportunities = 1;
                if(context.player.opponent) {
                    context.player.opponent.conflictOpportunities = 1;
                }
            }
        });
    }
}

WaningHostilities.id = 'waning-hostilities'; // This is a guess at what the id might be - please check it!!!

module.exports = WaningHostilities;
