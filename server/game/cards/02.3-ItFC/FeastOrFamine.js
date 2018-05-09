const ProvinceCard = require('../../provincecard.js');

class FeastOrFamine extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Move fate from an opposing character',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && context.player.cardsInPlay.any(
                    card => card.fate === 0 && card.allowGameAction('placeFate', context)
                )
            },
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player.opponent,
                gameAction: ability.actions.removeFate()
            },
            effect: 'move all fate from {0} to a character they control',
            handler: context => this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character',
                source: context.source,
                cardType: 'character',
                cardCondition: card => card.controller === context.player && card.allowGameAction('placeFate', context) && card.fate === 0,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves {1} fate from {2} to {3}', player, context.target.fate, context.target, card);
                    this.game.openEventWindow(ability.actions.removeFate(context.target.fate, card).getEvent(context.target, context));
                    return true;
                }
            })
        });
    }
}

FeastOrFamine.id = 'feast-or-famine';

module.exports = FeastOrFamine;
