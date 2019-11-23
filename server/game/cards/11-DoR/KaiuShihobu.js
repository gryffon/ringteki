const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Phases, Locations, CardTypes, PlayTypes, EventNames, Players } = require('../../Constants');

class KaiuShihobu extends DrawCard {
    holdingsToPlay = []
    
    setupCardAbilities() {
        this.reaction({
            title: 'Look at your dynasty deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.dynastyDeckSearch({ 
                cardCondition: card => card.type == CardTypes.Holding,
                selectAmount: -1,
                reveal: true,
                selectedCardsHandler: (context, event, cards) => {
                    if (cards.length > 0) {
                        event.player.createAdditionalPile('shihobu');
                        this.game.addMessage('{0} selects {1}', event.player, cards.map(e => e.name).join(', '))
                        this.holdingsToPlay = this.holdingsToPlay.concat(cards);
                        cards.forEach(card => {
                            event.player.moveCard(card, Locations.RemovedFromGame);
                        });
                    }
                    else
                        this.game.addMessage('{0} selects no holdings', event.player);
                    event.player.shuffleDynastyDeck();
                }
            })         
        });

        this.action({
            title: 'Put a holding in a province',
            targets: {
                first: {
                    activePromptTitle: 'Choose a holding',
                    cardType: CardTypes.Holding,
                    controller: Players.Self,
                    location: Locations.RemovedFromGame,
                    cardCondition: card => this.holdingsToPlay.includes(card)
                },
                second: {
                    activePromptTitle: 'Choose an unbroken province',
                    dependsOn: 'first',
                    optional: false,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken
                },
            },
            handler: context => {
                let holding = context.targets.first;
                let province = context.targets.second;

                let cards = context.player.getDynastyCardsInProvince(province.location);
                //Leaving this here since it sounds like she's going to be errata-ed to face up
                // this.game.addMessage('{0} discards {1}, replacing it with {2}', context.player, cards.map(e => e.name).join(', '), holding);
                this.game.addMessage('{0} discards {1}, replacing it with a facedown holding', context.player, cards.map(e => e.name).join(', '));
                context.player.moveCard(holding, province.location);
                holding.facedown = true;
                cards.forEach(card => {
                    context.player.moveCard(card, Locations.DynastyDiscardPile);
                });
            }
        });
    }
}

KaiuShihobu.id = 'kaiu-shihobu';

module.exports = KaiuShihobu;
