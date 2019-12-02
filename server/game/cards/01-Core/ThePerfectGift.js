const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class ThePerfectGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each player a gift',
            effect: 'give each player a gift',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.lookAt(context => ({
                    target: context.player.conflictDeck.first(4),
                    message: '{0} reveals the top {1} from their conflict deck: {2}',
                    messageArgs: cards => [context.player, cards.length, cards]
                })),
                AbilityDsl.actions.lookAt(context => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.first(4) : [],
                    message: '{0} reveals the top {1} from their conflict deck: {2}',
                    messageArgs: cards => [context.player.opponent, cards.length, cards]
                })),
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a card to give to yourself',
                    cards: context.player.conflictDeck.first(4),
                    targets: true,
                    message: '{0} chooses {1} to give to {2}',
                    messageArgs: (card, player) => [player, card, context.player],
                    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
                })),
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a card to give your opponent',
                    cards: context.player.opponent ? context.player.opponent.conflictDeck.first(4) : [],
                    targets: true,
                    message: '{0} chooses {1} to give to {2}',
                    messageArgs: (card, player) => [player, card, context.player.opponent],
                    gameAction: AbilityDsl.actions.moveCard({ destination: Locations.Hand })
                })),
                AbilityDsl.actions.shuffleDeck({
                    deck: Locations.ConflictDeck
                })
            ])
        });
    }
}

ThePerfectGift.id = 'the-perfect-gift';

module.exports = ThePerfectGift;
