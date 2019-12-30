const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');

class CurrentOfTheBeryt extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action({
            title: 'Take two actions',
            condition: () => this.game.isDuringConflict(),
            effect: 'take two actions',
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilPassPriority,
                effect: ability.effects.additionalAction(2)
            })
        });
    }
}

CurrentOfTheBeryt.id = 'current-of-the-beryt';

module.exports = CurrentOfTheBeryt;
