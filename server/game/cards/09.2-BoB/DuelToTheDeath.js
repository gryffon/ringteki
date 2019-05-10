const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class DuelToTheDeath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel, discarding the loser',
            initiateDuel: {
                type: DuelTypes.Military,
                refuseGameAction: AbilityDsl.actions.dishonor(context => ({ target: context.targets.duelTarget })),
                gameAction: duel => AbilityDsl.actions.discardFromPlay({ target: duel.loser })
            }
        });
    }
}

DuelToTheDeath.id = 'duel-to-the-death';

module.exports = DuelToTheDeath;
