const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes, Players, EffectNames } = require('../../Constants');
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
            gameAction: AbilityDsl.actions.playerLastingEffect(() => {
                return {
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.AdditionalCost((context) => {
                        if(context.source.type === CardTypes.Event) {
                            return [AbilityDsl.costs.giveHonorToOpponent(1)];
                        } else {
                            return [];
                        }
                    })
                };
            })
        });
    }
}

CommandRespect.id = 'command-respect';

module.exports = CommandRespect;
