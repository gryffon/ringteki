const DrawCard = require('../../drawcard.js');

class ShinjoTatsuo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this and another character to the conflict',
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player && card !== context.source,
                optional: true,
                gameAction: ability.actions.moveToConflict()
            },
            effect: 'move {1}{2}{3} into the conflict',
            effectArgs: context => [context.source, context.target ? ' and ' : '', context.target ? context.target : ''],
            handler: context => {
                let cards = [context.source];
                if(context.target) {
                    cards.push(context.target);
                }
                this.game.applyGameAction(context, { moveToConflict: cards });
            }
        });
    }
}

ShinjoTatsuo.id = 'shinjo-tatsuo';

module.exports = ShinjoTatsuo;
