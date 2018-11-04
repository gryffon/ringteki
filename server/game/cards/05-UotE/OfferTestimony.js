const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class OfferTestimony extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Both players reveal a card',
            condition: context => context.player.opponent && context.game.isDuringConflict('political'),
            targets: {
                myCharacter: {
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                },
                oppCharacter: {
                    player: 'opponent',
                    cardType: 'character',
                    controller: 'opponent',
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                }
            },
            effect: 'make each player choose a ready participating character they control: {1}',
            effectArgs: context => [Object.values(context.targets)],
            gameAction: [
                ability.actions.reveal(context => ({
                    chatMessage: true,
                    promptForSelect: {
                        activePromptTitle: 'Choose a card to reveal',
                        player: context.player,
                        location: Locations.Hand,
                        controller: 'self'
                    }
                })),
                ability.actions.reveal(context => ({
                    chatMessage: true,
                    player: context.player.opponent,
                    promptForSelect: {
                        activePromptTitle: 'Choose a card to reveal',
                        player: context.player.opponent,
                        location: Locations.Hand,
                        controller: 'opponent'
                    }
                })),
                ability.actions.bow(context => {
                    let revealedCards = context.ability.gameAction.filter(action => action.name === 'reveal').reduce((array, action) => array.concat(action.target), []);
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
