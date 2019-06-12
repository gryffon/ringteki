const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, DuelTypes } = require('../../Constants');

class DefendYourHonor extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() && context.player.opponent &&
                    event.card.type === CardTypes.Event
            },
            initiateDuel: context => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => duel.winner && duel.winner.controller === context.player && AbilityDsl.actions.cancel()
            })
        });
    }
}

DefendYourHonor.id = 'defend-your-honor';

module.exports = DefendYourHonor;
