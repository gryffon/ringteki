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
                        message: '{0} chooses a ring effect to resolve',
                        messageArgs: duel => duel.winner && duel.winner.controller,
                        gameAction: duel => AbilityDsl.actions.selectRing({
                            activePromptTitle: 'Choose a ring effect to resolve',
                            player: duel.winner && duel.winner.controller === context.player ? Players.Self : Players.Opponent,
                            ringCondition: () => !!duel.winner,
                            targets: true,
                            message: '{0} chooses to resolve {1}\'s effect',
                            messageArgs: ring => [duel.winner.controller, ring],
                            gameAction: AbilityDsl.actions.resolveRingEffect({ player: duel.winner && duel.winner.controller })
                        })
                    }))
                }
            }
        });
    }
}

TaryuJiai.id = 'taryu-jiai';

module.exports = TaryuJiai;
