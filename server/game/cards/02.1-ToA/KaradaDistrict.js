const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KaradaDistrict extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of an attachment',
            cost: AbilityDsl.costs.giveFateToOpponent(1),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player.opponent
            },
            gameAction: AbilityDsl.actions.ifAble(context => ({
                ifAbleAction: AbilityDsl.actions.selectCard({
                    target: context.target,
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.attach({
                        attachment: context.target,
                        takeControl: true
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (cards, player) => [player, context.target, cards]
                }),
                otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
            }))
        });
    }
}

KaradaDistrict.id = 'karada-district';

module.exports = KaradaDistrict;
