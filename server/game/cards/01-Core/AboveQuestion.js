const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class AboveQuestion extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });
    }
}

AboveQuestion.id = 'above-question';

module.exports = AboveQuestion;
