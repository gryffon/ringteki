const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');

class TaintedHero extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('declareAsAttacker'),
                ability.effects.cardCannot('declareAsDefender')
            ]
        });

        this.action({
            title: 'Make text box blank',
            cost: ability.costs.sacrifice(card => card.getType() === CardTypes.Character),
            gameAction: ability.actions.cardLastingEffect({
                match: this,
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.blank()
            })
        });
    }
}

TaintedHero.id = 'tainted-hero';

module.exports = TaintedHero;
