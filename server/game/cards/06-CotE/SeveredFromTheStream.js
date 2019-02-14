const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SeveredFromTheStream extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return player\'s rings',
            gameAction: AbilityDsl.actions.returnRing(context => {
                if(context.player.opponent && context.player.getGloryCount() < context.player.opponent.getGloryCount()) {
                    return { target: context.player.getClaimedRings() };
                } else if(context.player.opponent && context.player.getGloryCount() > context.player.opponent.getGloryCount()) {
                    return { target: context.player.opponent.getClaimedRings() };
                }
            })
        });
    }
}

SeveredFromTheStream.id = 'severed-from-the-stream';

module.exports = SeveredFromTheStream;
