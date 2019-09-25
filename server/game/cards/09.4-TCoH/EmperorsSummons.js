const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players } = require('../../Constants');

class EmperorsSummons extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search for a character card',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.cardMenu(context => ({
                cards: context.player.dynastyDeck.filter(card => card.type === CardTypes.Character),
                choices: ['Select nothing'],
                handlers: [() => this.game.addMessage('{0} selects nothing from their deck', context.player)],
                gameAction: AbilityDsl.actions.selectCard(selectContext => ({
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.location !== Locations.StrongholdProvince,
                    subActionProperties: card => ({ destination: card.location, target: context.player.getDynastyCardInProvince(card.location) }),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.moveCard({ target: selectContext.target }),
                        AbilityDsl.actions.discardCard()
                    ]),
                    message: '{1} chooses to place {2} in {0} discarding {3}',
                    messageArgs: (card, player, properties) => [card.location, player, properties.target, player.getDynastyCardInProvince(card.location)]
                }))
            })),
            effect: 'choose a character to place in a province'
        });
    }
}

EmperorsSummons.id = 'emperor-s-summons';

module.exports = EmperorsSummons;
