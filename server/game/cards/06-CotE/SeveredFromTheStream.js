const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SeveredFromTheStream extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return player\'s rings',
            gameAction: AbilityDsl.actions.performGloryCount({
                gameAction: winner => winner && winner.opponent && AbilityDsl.actions.returnRing({
                    target: winner.opponent.getClaimedRings()
                })
            })
        });
    }
}

SeveredFromTheStream.id = 'severed-from-the-stream';

module.exports = SeveredFromTheStream;
