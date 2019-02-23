const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class KitsukiInvestigator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at opponent\'s hand',
            condition: context => context.source.isParticipating() && this.game.isDuringConflict('political') &&
                                  context.player.opponent && context.player.opponent.hand.size() > 0,
            cost: AbilityDsl.costs.payFateToRing(),
            effect: 'reveal {1}\'s hand and discard a card from it',
            effectArgs: context => context.player.opponent,
            gameAction: [
                AbilityDsl.actions.lookAt(context => ({
                    target: context.player.opponent.hand.sortBy(card => card.name)
                })),
                AbilityDsl.actions.cardMenu(context => ({
                    cards: context.player.opponent.hand.sortBy(card => card.name),
                    targets: true,
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: card => [context.player, card],
                    gameAction: AbilityDsl.actions.discardCard()
                }))
            ],
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}

KitsukiInvestigator.id = 'kitsuki-investigator';

module.exports = KitsukiInvestigator;
