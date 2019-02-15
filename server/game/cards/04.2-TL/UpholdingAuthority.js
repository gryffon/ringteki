const ProvinceCard = require('../../provincecard.js');

class UpholdingAuthority extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.role && context.player.role.hasTrait('earth'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        let gameAction = ability.actions.menuPrompt(context => ({
            activePromptTitle: 'Choose how many cards to discard',
            choices: properties => Array.from(Array(context.player.opponent.hand.filter(card => card.name === properties.target[0].name).length), (x, i) => i + 1),
            gameAction: ability.actions.discardCard(),
            choiceHandler: (choice, displayMessage, properties) => {
                let chosenCard = properties.target[0];
                if(displayMessage) {
                    this.game.addMessage('{0} chooses to discard {1} cop{2} of {3}', context.player, choice, (choice === 1 ? 'y' : 'ies'), chosenCard);
                }
                return { target: context.player.opponent.hand.filter(card => card.name === chosenCard.name).slice(0, parseInt(choice)) };
            }
        }));

        this.interrupt({
            title: 'Look at opponent\'s hand and discard all copies of a card',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && context.player.opponent && context.player.opponent.hand.size() > 0
            },
            effect: 'look at their opponent\'s hand and choose a card to be discarded',
            gameAction: ability.actions.cardMenu(context => ({
                activePromptTitle: 'Choose a card to discard',
                cards: context.player.opponent.hand.sortBy(card => card.name),
                targets: true,
                message: '{0} reveals their hand: {1}',
                messageArgs: () => [context.player.opponent, context.player.opponent.hand.sortBy(card => card.name)],
                gameAction: gameAction,
                choices: ['Don\'t discard anything'],
                handlers: [() => context.game.addMessage('{0} chooses not to discard anything', context.player)]
            }))
        });
    }
}

UpholdingAuthority.id = 'upholding-authority';

module.exports = UpholdingAuthority;
