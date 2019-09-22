const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SeveredFromTheStream extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return player\'s rings',
            gameAction: AbilityDsl.actions.performGloryCount({
                postHandler: event => {
                    if(event.loser) {
                        this.game.addMessage('{0} loses the glory count, and all their rings are returned to the unclaimed pool', event.loser);
                        AbilityDsl.actions.returnRing().resolve(event.loser.getClaimedRings(), event.context);
                    }
                }
            })
        });
    }
}

SeveredFromTheStream.id = 'severed-from-the-stream';

module.exports = SeveredFromTheStream;
