const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Phases, Locations } = require('../../Constants');

class KyudenHida extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a Character',
            condition: context => context.player.dynastyDeck.size() > 0,
            phase: Phases.Dynasty,
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'look at the top three cards of their dynasty deck',
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                activePromptTitle: 'Choose a character',
                cards: context.player.dynastyDeck.first(3),
                cardCondition: card => card.type === CardTypes.Character,
                choices: ['Take nothing'],
                handlers: [() => {
                    let cards = [];
                    context.player.dynastyDeck.first(3).forEach(card => {
                        context.player.moveCard(card, Locations.DynastyDiscardPile);
                        cards = cards.concat(card.name);
                    });
                    this.game.addMessage('{0} chooses not to play a character', context.player);
                    this.game.addMessage('{0} discards {1}', context.player, cards.join(', '));
                    return true;
                }],
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: false,
                    postHandler: hidaContext => {
                        let cards = [];
                        let card = hidaContext.source;
                        if(card.location !== Locations.PlayArea) {
                            this.game.addMessage('{0} chooses not to play a character', context.player);
                            context.player.moveCard(card, Locations.DynastyDiscardPile);
                            cards = cards.concat(card.name);
                        }
                        context.player.dynastyDeck.first(2).forEach(card => {
                            context.player.moveCard(card, Locations.DynastyDiscardPile);
                            cards = cards.concat(card.name);
                        });
                        this.game.addMessage('{0} discards {1}', context.player, cards.join(', '));
                    }
                })
            }))
        });
    }
}

KyudenHida.id = 'kyuden-hida';
module.exports = KyudenHida;

