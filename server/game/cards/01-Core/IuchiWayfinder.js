const DrawCard = require('../../drawcard.js');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.player.opponent &&
                                                      context.game.allCards.any(card => card.isProvince && card.controller === context.player.opponent)
            },
            effect: 'reveal a province',
            handler: context => this.game.promptForSelect(context.player, {
                source: context.source,
                activePromptTitle: 'Choose a province to reveal',
                cardType: 'province',
                cardCondition: card => card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} reveals {1}', context.source, card);
                    return true;
                }
            })
        });
    }
}

IuchiWayfinder.id = 'iuchi-wayfinder';

module.exports = IuchiWayfinder;
