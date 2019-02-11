const DrawCard = require('../../drawcard.js');
const { CardTypes, DuelTypes } = require('../../Constants');

class DefendYourHonor extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() &&
                    event.card.type === CardTypes.Event && context.player.opponent
            },
            initiateDuel: context => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                resolutionHandler: (winner) => this.resolutionHandler(context, winner)
            })
        });
    }

    resolutionHandler(context, winner) {
        if(winner.controller === context.source.controller) {
            this.game.addMessage('{0} wins the duel and cancels {1}\'s effect', winner, context.event.card);
            context.cancel();
        }
    }
}

DefendYourHonor.id = 'defend-your-honor';

module.exports = DefendYourHonor;
