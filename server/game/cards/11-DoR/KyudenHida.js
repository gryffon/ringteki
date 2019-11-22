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
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose a character',
                    cards: context.player.dynastyDeck.first(3),
                    cardCondition: card => card.type === CardTypes.Character,
                    choices: ['Take nothing'],
                    handlers: [() => {
                        context.player.dynastyDeck.first(3).forEach(card => {
                            context.player.moveCard(card, Locations.DynastyDiscardPile);
                        });
                        this.game.addMessage('{0} chooses not to play a character', context.player);
                        return true;
                    }],
                    gameAction: AbilityDsl.actions.playCard({
                        resetOnCancel: false,
                        postHandler: hidaContext => {
                            let card = hidaContext.source;
                            if(card.location !== Locations.PlayArea) {
                                context.player.moveCard(card, Locations.DynastyDiscardPile);
                                this.game.addMessage('{0} chooses not to play a character', context.player);
                            }
                        }
                    })
                })),
                AbilityDsl.actions.moveCard((context) => ({
                    target: context.player.dynastyDeck.first(2),
                    faceup: true,
                    destination: Locations.DynastyDiscardPile
                }))
            ])
        });
    }
}

KyudenHida.id = 'kyuden-hida';
module.exports = KyudenHida;

