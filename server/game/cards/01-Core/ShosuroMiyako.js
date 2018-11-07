const DrawCard = require('../../drawcard.js');
const { Players, TargetModes, CardTypes } = require('../../Constants');

class ShosuroMiyako extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards or dishonors',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.playType === 'playFromHand' &&
                                                  event.card.type === CardTypes.Character && context.player.opponent
            },
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: {
                    'Discard at random': ability.actions.discardAtRandom(),
                    'Dishonor a character': ability.actions.dishonor(context => ({
                        promptForSelect: {
                            activePromptTitle: 'Choose a character to dishonor',
                            player: context.player.opponent,
                            controller: Players.Opponent,
                            message: '{0} chooses to dishonor {1}',
                            messageArgs: card => [context.player.opponent, card]
                        }
                    }))
                }
            },
            effect: 'force {1} to {2}',
            effectArgs: context => [context.player.opponent, context.select.toLowerCase()]
        });
    }
}

ShosuroMiyako.id = 'shosuro-miyako';

module.exports = ShosuroMiyako;
