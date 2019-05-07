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
                gameAction: duel => AbilityDsl.actions.placeFate({
                    target: duel.winner
                })
            }
        });
    }
}

DaringChallenger.id = 'daring-challenger';

module.exports = DaringChallenger;
