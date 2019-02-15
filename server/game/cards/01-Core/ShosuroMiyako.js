const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, TargetModes, CardTypes, PlayTypes } = require('../../Constants');

class ShosuroMiyako extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Opponent discards or dishonors',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.playType === PlayTypes.PlayFromHand &&
                                                  event.card.type === CardTypes.Character && context.player.opponent
            },
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: {
                    'Discard at random': AbilityDsl.actions.discardAtRandom(),
                    'Dishonor a character': AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a character to dishonor',
                        player: context.player.opponent,
                        controller: Players.Opponent,
                        targets: true,
                        message: '{0} chooses to dishonor {1}',
                        messageArgs: card => [context.player.opponent, card],
                        gameAction: AbilityDsl.actions.dishonor()
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
