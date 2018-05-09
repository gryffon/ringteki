const DrawCard = require('../../drawcard.js');

class AdeptOfTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            effect: 'grant Covert during Water conflicts to {0}',
            untilEndOfPhase: context => ({
                match: context.target,
                condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('water'),
                effect: ability.effects.addKeyword('covert')
            })
        });
    }
}

AdeptOfTheWaves.id = 'adept-of-the-waves';

module.exports = AdeptOfTheWaves;
