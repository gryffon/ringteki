const DrawCard = require('../../drawcard.js');

class KaiuInventor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: 'holding',
                cardCondition: card => card.controller === this.controller && !card.facedown
            },
            effect: 'add an additional use to each of {0}\'s abilities',
            untilEndOfRound: context => ({
                match: context.target,
                targetLocation: 'province',
                effect: ability.effects.increaseLimitOnAbilities(1)
            })
        });
    }
}

KaiuInventor.id = 'kaiu-inventor';

module.exports = KaiuInventor;
