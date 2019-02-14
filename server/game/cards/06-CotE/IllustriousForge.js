const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Players, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IllustriousForge extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search for an attachment',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && context.player.conflictDeck.size() > 0
            },
            effect: 'search the top 5 cards of their conflict deck for an attachment and put it into play',
            gameAction: AbilityDsl.actions.sequentialAction([
                AbilityDsl.actions.cardMenu(context => ({
                    activePromptTitle: 'Choose an attachment',
                    cards: context.player.conflictDeck.first(5).filter(card =>
                        card.type === CardTypes.Attachment
                    ),
                    choices: ['Take nothing'],
                    handlers: [() => {
                        this.game.addMessage('{0} takes nothing', context.player);
                        return true;
                    }],
                    actionParameter: 'attachment',
                    gameAction: AbilityDsl.actions.selectCard({
                        controller: Players.Self,
                        location: Locations.PlayArea,
                        cardType: CardTypes.Character,
                        gameAction: AbilityDsl.actions.attach()
                    })
                })),
                AbilityDsl.actions.shuffleDeck(context => ({
                    deck: Locations.ConflictDeck,
                    target: context.player
                }))
            ])
        });
    }
}

IllustriousForge.id = 'illustrious-forge';

module.exports = IllustriousForge;
