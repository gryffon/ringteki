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
            initiateDuel: {
                type: DuelTypes.Military,
                message: '1 fate is placed on {0} due to winning the duel',
                messageArgs: context => context.game.currentDuel.winner,
                gameAction: AbilityDsl.actions.placeFate(context => ({
                    target: context.game.currentDuel.winner
                }))
            }
        });
    }
}

DaringChallenger.id = 'daring-challenger';

module.exports = DaringChallenger;
