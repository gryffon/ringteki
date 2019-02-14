const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, DuelTypes } = require('../../Constants');

class PrudentChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose an attachment to discard',
                    cardType: CardTypes.Attachment,
                    cardCondition: (card, context) => context.game.currentDuel && card.parent === context.game.currentDuel.loser,
                    targets: true,
                    message: '{0} chooses to discard {1}',
                    messageArgs: (card, player) => [player, card],
                    gameAction: AbilityDsl.actions.discardFromPlay()
                })
            }
        });
    }
}

PrudentChallenger.id = 'prudent-challenger';

module.exports = PrudentChallenger;
