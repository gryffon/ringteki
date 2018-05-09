const DrawCard = require('../../drawcard.js');

class HirumaSkirmisher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain covert until end of phase',
            when: {
                'onCharacterEntersPlay': (event, context) => event.card === context.source
            },
            effect: 'give itself Covert until the end of the phase',
            untilEndOfPhase: context => ({
                match: context.source,
                effect: ability.effects.addKeyword('covert')
            })
        });
    }
}

HirumaSkirmisher.id = 'hiruma-skirmisher';

module.exports = HirumaSkirmisher;
