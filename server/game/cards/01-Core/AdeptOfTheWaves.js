const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AdeptOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    duration: Durations.UntilEndOfPhase,
                    condition: () => this.game.isDuringConflict('water'),
                    effect: AbilityDsl.effects.addKeyword('covert')
                }))
            },
            effect: 'grant Covert during Water conflicts to {0}'
        });
    }
}

AdeptOfTheWaves.id = 'adept-of-the-waves';

module.exports = AdeptOfTheWaves;
