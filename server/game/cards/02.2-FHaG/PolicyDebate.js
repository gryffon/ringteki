const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

class PolicyDebate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.duel(context => ({
                        type: DuelTypes.Political,
                        challenger: context.targets.challenger,
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.lookAt(context => ({
                                target: context.game.currentDuel.loser ? context.game.currentDuel.loser.controller.hand.sortBy(card => card.name) : []
                            })),
                            AbilityDsl.actions.cardMenu(context => ({
                                activePromptTitle: 'Choose card to discard',
                                player: context.game.currentDuel.loser && context.game.currentDuel.loser.controller === context.player ? Players.Self : Players.Opponent,
                                cards: context.game.currentDuel.loser ? context.game.currentDuel.loser.controller.hand.sortBy(card => card.name) : [],
                                targets: true,
                                message: '{0} chooses {1} to be discarded',
                                messageArgs: card => [context.game.currentDuel.winner.controller, card],
                                gameAction: AbilityDsl.actions.discardCard()
                            }))
                        ])
                    }))
                }
            }
        });
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
