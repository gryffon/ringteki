const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');

class AdeptOfTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: 'character',
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: Durations.UntilEndOfPhase,
                    condition: () => this.game.isDuringConflict('water'),
                    effect: ability.effects.addKeyword('covert')
                }))
            },
            effect: 'grant Covert during Water conflicts to {0}'
        });
    }
}

AdeptOfTheWaves.id = 'adept-of-the-waves';

module.exports = AdeptOfTheWaves;
