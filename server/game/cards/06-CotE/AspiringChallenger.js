const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class AspiringChallenger extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyGlory(2)
        });
        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} wins the duel and is honored',
                messageArgs: context => context.game.currentDuel.winner,
                gameAction: AbilityDsl.actions.honor(context => ({
                    target: context.game.currentDuel.winner
                }))
            }
        });
    }
}

AspiringChallenger.id = 'aspiring-challenger';

module.exports = AspiringChallenger;
