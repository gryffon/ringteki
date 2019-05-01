const DrawCard = require('../../drawcard.js');
const { Durations, DuelTypes, Players } = require('../../Constants');

class CourteousScheming extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            condition: () =>
                this.game.currentConflict &&
                this.game.currentConflict.conflictType === 'political',
            initiateDuel: context => ({
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                gameAction: duel =>
                    duel.winner &&
                    ability.actions.playerLastingEffect({
                        targetController:
                            duel.winner.controller === context.player
                                ? Players.Self
                                : Players.Opponent,
                        duration: Durations.UntilEndOfPhase,
                        effect: ability.effects.additionalConflict('political')
                    })
            }),
            max: ability.limit.perRound(1)
        });
    }
}

CourteousScheming.id = 'courteous-scheming';
module.exports = CourteousScheming;
