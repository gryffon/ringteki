const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

const { Durations, Players } = require('../../Constants');

class CourtMusician extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase cost to play cards',
            condition: context => context.source.isParticipating(),
            effect: 'increase the cost of cards played by 1 for each player\'s next action opportunity',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => {
                const currentActionWindow = context.game.currentActionWindow;
                const opportunityCounter = currentActionWindow.opportunityCounter;
                return {
                    targetController: Players.Any,
                    duration: Durations.Custom,
                    effect: AbilityDsl.effects.reduceCost({
                        amount: 1
                    }),
                    until: {
                        onPassActionPhasePriority: event =>
                            event.player === context.player && event.actionWindow === currentActionWindow &&
                            currentActionWindow.opportunityCounter > opportunityCounter + 1
                    }
                };
            })
        });
    }
}

CourtMusician.id = 'court-musician';

module.exports = CourtMusician;

