const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, Locations } = require('../../Constants');

class AgashaShunsen extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return rings to fetch an attachment',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.returnRings(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cardMenu(context => ({
                    cards: context.player.conflictDeck.filter(card =>
                        card.type === CardTypes.Attachment &&
                        card.costLessThan(context.costs.returnRing ? context.costs.returnRing.length + 1 : 1)
                    ),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: card => [context.player, card, context.target],
                    choices: ['Don\'t attach a card'],
                    handlers: [() => this.game.addMessage('{0} chooses not to attach anything to {1}', context.player, context.target)],
                    gameAction: AbilityDsl.actions.attach(),
                    subActionProperties: card => ({ attachment: card })
                }))
            },
            effect: 'search their deck for an attachment costing {1} or less and attach it to {0}',
            effectArgs: context => context.costs.returnRing.length,
            gameAction: AbilityDsl.actions.shuffleDeck({ deck: Locations.ConflictDeck })
        });
    }
}

AgashaShunsen.id = 'agasha-shunsen';

module.exports = AgashaShunsen;
