const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CommandRespect extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'takes honors from opponent when they play an event',
            condition: context => {
                return context.player.hand.size() < context.player.opponent.hand.size() &&
                context.game.isDuringConflict();
            },
            max: AbilityDsl.limit.perConflict(1),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                // condition: () => context.target.isDefending(),
                effect: AbilityDsl.actions.takeHonor()
            }))
        });
    }
}

CommandRespect.id = 'command-respect';

module.exports = CommandRespect;
