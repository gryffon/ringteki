const DrawCard = require('../../drawcard.js');
const { CardTypes, DuelTypes, Players } = require('../../Constants');

class DefendYourHonor extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() &&
                    event.card.type === CardTypes.Event && context.player.opponent
            },
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                }
            },
            effect: 'initiate a military duel between {1} and {2}',
            effectArgs: (context) => [context.targets.challenger, context.targets.duelTarget],
            handler: context => {
                this.game.actions.duel({
                    type: DuelTypes.Military,
                    challenger: context.targets.challenger,
                    target: context.targets.duelTarget,
                    resolutionHandler: (winner) => this.resolutionHandler(context, winner)
                }).resolve(null, context);
            }
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
