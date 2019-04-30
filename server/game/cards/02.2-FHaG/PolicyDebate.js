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
                        message: '{0} sees {1}\'s hand and chooses a card to discard',
                        messageArgs: duel => [duel.loser && duel.loser.controller.opponent, duel.loser.controller],
                        gameAction: duel => AbilityDsl.actions.multiple([
                            AbilityDsl.actions.lookAt({
                                target: duel.loser ? duel.loser.controller.hand.sortBy(card => card.name) : []
                            }),
                            AbilityDsl.actions.cardMenu({
                                activePromptTitle: 'Choose card to discard',
                                player: duel.loser && duel.loser.controller === context.player ? Players.Opponent : Players.Self,
                                cards: duel.loser ? duel.loser.controller.hand.sortBy(card => card.name) : [],
                                targets: true,
                                message: '{0} chooses {1} to be discarded',
                                messageArgs: card => [duel.loser.controller.opponent, card],
                                gameAction: AbilityDsl.actions.discardCard()
                            })
                        ])
                    }))
                }
            }
        });
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
