const StrongholdCard = require('../../strongholdcard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class HighHouseOfLight extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character with attachments bonus skill',
            cost: AbilityDsl.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsEvents'
                        })
                    })),
                    AbilityDsl.actions.conditional({
                        condition: context => this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 5,
                        trueGameAction: AbilityDsl.actions.selectRing(context => ({
                            activePromptTitle: 'Choose a ring to take a fate from',
                            message: '{0} moves a fate from the {1} to {2}',
                            ringCondition: ring => ring.fate >= 1,
                            messageArgs: ring => [context.player, ring, context.target],
                            subActionProperties: ring => ({origin: ring}),
                            gameAction: AbilityDsl.actions.placeFate({ target: context.target })
                        })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ])
            },
            effect: 'make {0} unable to be targeted by opponent\'s events',
            effectArgs: context => [Math.min(context.target.attachments.size(), 2), 'military', 'political']
        });
    }
}

HighHouseOfLight.id = 'high-house-of-light';

module.exports = HighHouseOfLight;
