const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class TaintedKoku extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Move attachment to another character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.controller === context.source.parent.controller && card !== context.source.parent,
                gameAction: ability.actions.attach(context => ({ attachment: context.source }))
            }
        });
    }
}

TaintedKoku.id = 'tainted-koku';

module.exports = TaintedKoku;
