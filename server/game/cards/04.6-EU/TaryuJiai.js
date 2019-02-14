const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

class TaryuJiai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a glory duel between two shugenja',
            condition: () => this.game.isDuringConflict(),
            targets: {
                myShugenja: {
                    activePromptTitle: 'Choose a friendly shugenja',
                    controller: Players.Self,
                    cardType: CardTypes.Character,
                    cardCondition: card => card.hasTrait('shugenja')
                },
                oppShugenja: {
                    dependsOn: 'myShugenja',
                    activePromptTitle: 'Choose an opposing shugenja',
                    controller: Players.Opponent,
                    cardType: CardTypes.Character,
                    cardCondition: card => card.hasTrait('shugenja'),
                    gameAction: AbilityDsl.actions.duel(context => ({
                        type: DuelTypes.Glory,
                        challenger: context.targets.myShugenja,
                        gameAction: AbilityDsl.actions.selectRing(context => ({
                            activePromptTitle: 'Choose a ring effect to resolve',
                            player: context.game.currentDuel.winner && context.game.currentDuel.winner.controller === context.player ? Players.Self : Players.Opponent,
                            ringCondition: () => !!context.game.currentDuel.winner,
                            targets: true,
                            message: '{0} chooses to resolve {1}\'s effect',
                            messageArgs: ring => [context.game.currentDuel.winner.controller, ring],
                            gameAction: AbilityDsl.actions.resolveRingEffect()
                        }))
                    }))
                }
            }
        });
    }
}

TaryuJiai.id = 'taryu-jiai';

module.exports = TaryuJiai;
