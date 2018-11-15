const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class HandToHand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            condition: () => this.game.isDuringConflict('military'),
            gameAction: ability.actions.discardFromPlay(context => ({
                promptForSelect: {
                    cardType: CardTypes.Attachment,
                    cardCondition: card => card.parent && card.parent.isParticipating(),
                    optional: true,
                    message: '{0} chooses to discard {1} from play',
                    messageArgs: card => [context.player, card],
                    onCancel: () => {
                        this.game.addMessage('{0} chooses to not resolve {1}', context.player, context.source);
                        return true;
                    }
                }
            })),
            then: context => ({
                gameAction: ability.actions.discardFromPlay({
                    promptForSelect: {
                        player: context.player.opponent,
                        cardType: CardTypes.Attachment,
                        cardCondition: card => card.parent && card.parent.isParticipating(),
                        optional: true,
                        message: '{0} chooses to discard {1} from play',
                        messageArgs: card => [context.player, card],
                        onCancel: () => {
                            this.game.addMessage('{0} chooses to not resolve {1}', context.player, context.source);
                            return true;
                        }
                    }
                }),
                then: {
                    gameAction: ability.actions.resolveAbility({
                        ability: context.ability
                    })
                }
            })
        });
    }
}

HandToHand.id = 'hand-to-hand';

module.exports = HandToHand;
