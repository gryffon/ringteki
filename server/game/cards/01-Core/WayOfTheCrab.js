const DrawCard = require('../../drawcard.js');

class WayOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make your opponent sacrifice a character',
            condition: context => context.player.opponent && context.player.opponent.cardsInPlay.any(card => card.allowGameAction('sacrifice', context)),
            cost: ability.costs.sacrifice(card => card.type === 'character' && card.isFaction('crab')),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.sacrifice().promptForSelect(context => ({
                player: context.player.opponent,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: 'character',
                message: '{0} sacrifices {2}'
            })),
            max: ability.limit.perRound(1)
        });
    }
}

WayOfTheCrab.id = 'way-of-the-crab';

module.exports = WayOfTheCrab;
