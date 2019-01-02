const DrawCard = require('../../drawcard.js');

class AspirantChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyMilitarySkill(2)
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

AspirantChallenger.id = 'aspirant-challenger';

module.exports = AspirantChallenger;
