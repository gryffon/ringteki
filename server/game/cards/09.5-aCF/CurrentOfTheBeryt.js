const DrawCard = require('../../drawcard.js');
const { Players, Durations } = require('../../Constants');

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
            gameAction: [
                ability.actions.playerLastingEffect(context => ({
                    targetController: Players.Self,
                    effect: ability.effects.gainActionPhasePriority(2),
                    duration: Durations.Custom,
                    until: {
                        onPassActionPhasePriority: event =>
                            event.player === context.player && event.consecutiveActions > 2
                    }
                }))
            ]
        });
    }
}

CurrentOfTheBeryt.id = 'current-of-the-beryt';

module.exports = CurrentOfTheBeryt;
