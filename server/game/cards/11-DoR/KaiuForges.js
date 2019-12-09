const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, Players } = require('../../Constants');

class KaiuForges extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a province',
            target: {
                location: Locations.Provinces,
                controller: Players.Self,
                cardType: CardTypes.Province
            },
            effect: 'look at the top ten cards of their dynasty deck',
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a holding to swap with a Kaiu Wall',
                context: context,
                cardCondition: card => card.getType() === CardTypes.Holding,
                cards: context.player.dynastyDeck.first(10),
                choices: ['Take nothing'],
                handlers: [() => {
                    this.game.addMessage('{0} takes nothing', context.player);
                    context.player.shuffleDynastyDeck();
                    return true;
                }],
                cardHandler: cardFromDeck => {
                    let provinceLocation = context.target.location;
                    let cards = context.player.getDynastyCardsInProvince(provinceLocation);
                    if(cards.some(a => a.getType() === CardTypes.Holding && a.hasTrait('kaiu-wall'))) {
                        this.game.promptForSelect(context.player, {
                            activePrompt: 'Choose a Kaiu Wall to swap with',
                            cardType: CardTypes.Holding,
                            location: Locations.Provinces,
                            controller: Players.Self,
                            context: context,
                            targets: false,
                            cardCondition: card => cards.includes(card) && card.hasTrait('kaiu-wall'),
                            onSelect: (player, card) => {
                                this.game.addMessage('{0} chooses to replace {1} with {2}', player, card, cardFromDeck);
                                context.player.moveCard(cardFromDeck, provinceLocation);
                                context.player.moveCard(card, Locations.DynastyDeck);
                                cardFromDeck.facedown = false;
                                context.player.shuffleDynastyDeck();
                                return true;
                            }
                        });
                    } else {
                        this.game.addMessage('{0} cannot put a holding into play because there is no Kaiu Wall in the selected province', context.player);
                        context.player.shuffleDynastyDeck();
                    }
                }
            })
        });
    }
}

KaiuForges.id = 'kaiu-forges';

module.exports = KaiuForges;
