const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AspiringChallenger extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyGlory(2)
        });
        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: context => ({
                type: 'military',
                resolutionHandler: (winner) => this.resolutionHandler(context, winner)
            })
        });
    }

    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel and is honored', winner);
        this.game.applyGameAction(context, { honor: winner });
    }
}

AspiringChallenger.id = 'aspiring-challenger';

module.exports = AspiringChallenger;
