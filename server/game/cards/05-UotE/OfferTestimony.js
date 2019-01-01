const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes, EventNames } = require('../../Constants');

class OfferTestimony extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Both players reveal a card',
            condition: context => context.player.opponent && context.game.isDuringConflict('political'),
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                }
            },
            effect: 'make each player choose a ready participating character they control: {1}',
            effectArgs: context => [Object.values(context.targets)],
            gameAction: [
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    location: Locations.Hand,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    player: Players.Opponent,
                    location: Locations.Hand,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
                }),
                AbilityDsl.actions.bow(context => {
                    let events = context.events.filter(event => event.name === EventNames.OnCardRevealed);
                    let revealedCards = events.map(event => event.card);
                    let lowestCost = Math.min(...revealedCards.map(card => card.getCost()).filter(number => Number.isInteger(number)));
                    let lowestCostPlayers = revealedCards.filter(card => card.getCost() === lowestCost).map(card => card.controller);
                    return { target: Object.values(context.targets).filter(card => lowestCostPlayers.includes(card.controller)) };
                })
            ]
        });
    }
}

OfferTestimony.id = 'offer-testimony';

module.exports = OfferTestimony;
