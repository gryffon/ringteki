const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AsakoAzunami extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Bow and ready two characters instead of the water effect',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'water' && event.player === context.player
            },
            effect: 'replace the water ring effect with bowing and readying two characters',
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to bow',
                        optional: true,
                        gameAction: AbilityDsl.actions.bow(),
                        targets: true,
                        message: '{0} chooses to bow {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    }),
                    AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        optional: true,
                        gameAction: AbilityDsl.actions.ready(),
                        targets: true,
                        message: '{0} chooses to ready {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })
                ])
            }))
        });
    }
}

AsakoAzunami.id = 'asako-azunami';

module.exports = AsakoAzunami;
