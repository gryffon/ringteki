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
                gameAction: duel => AbilityDsl.actions.honor({
                    target: duel.winner
                })
            }
        });
    }
}

AspiringChallenger.id = 'aspiring-challenger';

module.exports = AspiringChallenger;
