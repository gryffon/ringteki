const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Players } = require('../../Constants');

class TaoistAdept extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: 'choose whether to place a fate on a ring',
                gameAction: duel => AbilityDsl.actions.menuPrompt(context => ({
                    activePromptTitle: 'Place a fate on a ring?',
                    player: (duel.winner && duel.winner.controller === context.player) ? Players.Self : Players.Opponent,
                    choices: duel.winner ? ['Yes', 'No'] : [],
                    choiceHandler: (choice, displayMessage) => {
                        if(displayMessage && choice === 'Yes') {
                            this.game.promptForRingSelect(duel.winner.controller, {
                                activePromptTitle: 'Choose a ring to receive a fate',
                                player: duel.winner.controller,
                                context: context,
                                ringCondition: ring => ring.isUnclaimed(),
                                onSelect: (player, ring) => {
                                    context.game.addMessage('{0} chooses to place a fate on the {1}', player, ring);
                                    this.game.applyGameAction(context, { placeFateOnRing: ring });
                                }
                            });
                        }
                        if(displayMessage && choice === 'No') {
                            context.game.addMessage('{0} chooses not to place a fate on a ring', duel.winner.controller);
                        }
                        return [];
                    },
                    gameAction: AbilityDsl.actions.placeFateOnRing()
                }))
            }
        });
    }
}

TaoistAdept.id = 'taoist-adept';

module.exports = TaoistAdept;
