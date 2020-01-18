const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes, Players, TargetModes, Decks } = require('../../Constants');

class KaiuShihobu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at your dynasty deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                cardCondition: card => card.type === CardTypes.Holding,
                targetMode: TargetModes.Unlimited,
                reveal: true,
                deck: Decks.DynastyDeck,
                destination: Locations.UnderneathStronghold,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1}', event.player, cards.map(e => e.name).sort().join(', '));
                        cards.forEach(card => {
                            event.player.stronghold.addChildCard(card, Locations.UnderneathStronghold);
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event => event.card === card && event.originalLocation === Locations.UnderneathStronghold
                                },
                                match: card,
                                effect: [
                                    AbilityDsl.effects.hideWhenFaceUp()
                                ]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no holdings', event.player);
                    }
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
                    location: Locations.UnderneathStronghold,
                    cardCondition: (card, context) => context.player.stronghold.childCards.includes(card)
                },
                second: {
                    activePromptTitle: 'Choose an unbroken province',
                    dependsOn: 'first',
                    optional: false,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken
                }
            },
            handler: context => {
                let holding = context.targets.first;
                let province = context.targets.second;

                let cards = context.player.getDynastyCardsInProvince(province.location);
                context.player.stronghold.removeChildCard(holding, province.location);
                holding.facedown = false;
                cards.forEach(card => {
                    context.player.moveCard(card, Locations.DynastyDiscardPile);
                });
            },
            effect: 'discard {1}, replacing it with a facedown holding',
            effectArgs: context => context.player.getDynastyCardsInProvince(context.targets.second.location).map(e => e.name).sort().join(', ')
        });
    }
}

KaiuShihobu.id = 'kaiu-shihobu';

module.exports = KaiuShihobu;
