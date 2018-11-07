const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent,
            cost: ability.costs.sacrifice(card => card.type === CardTypes.Character && card.isFaction('crab')),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.sacrifice(context => ({
                promptForSelect: {
                    player: context.player.opponent,
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    message: '{0} sacrifices {1} to {2}',
                    messageArgs: card => [context.player.opponent, card, context.source]
                }
            })),
            max: ability.limit.perRound(1)
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
