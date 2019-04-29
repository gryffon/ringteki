const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, DuelTypes } = require('../../Constants');

class PrudentChallenger extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a duel to discard attachment',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} chooses one of {1}\'s attachments to discard',
                messageArgs: duel => [duel.winner && duel.winner.controller, duel.loser],
                gameAction: duel => AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose an attachment to discard',
                    cardType: CardTypes.Attachment,
                    cardCondition: card => card.parent === duel.loser,
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
