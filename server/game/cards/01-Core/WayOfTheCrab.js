const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('crab')
            }),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.selectCard(context => ({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                message: '{0} sacrifices {1} to {2}',
                messageArgs: card => [context.player.opponent, card, context.source],
                gameAction: AbilityDsl.actions.sacrifice()
            })),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
