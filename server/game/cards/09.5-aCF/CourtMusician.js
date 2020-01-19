const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

const { Durations, Players } = require('../../Constants');

class CourtMusician extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Decrease cost to play cards',
            condition: context => context.source.isParticipating(),
            effect: 'decrease the cost of cards played by 1 for each player\'s next action opportunity',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                duration: Durations.UntilNextPassPriority,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1
                })
            })
        });
    }
}

CourtMusician.id = 'court-musician';

module.exports = CourtMusician;

