const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { DuelTypes } = require('../../Constants');

class DaringChallenger extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                resolutionHandler: winner => this.resolutionHandler(context, winner)
            })
        });
    }
    resolutionHandler(context, winner) {
        this.game.addMessage('1 fate is placed on {0} due to winning the duel', winner);
        this.game.actions.placeFate().resolve(winner, context);
    }
}

DaringChallenger.id = 'daring-challenger';

module.exports = DaringChallenger;
