const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Durations, CardTypes } = require('../../Constants');

class YasukiProcurer extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of the next attachment or character',
            cost: AbilityDsl.costs.dishonorSelf(),
            effect: 'reduce the cost of their next attachment or character played this phase by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Attachment || card.type === CardTypes.Character)
            })
        });
    }
}

YasukiProcurer.id = 'yasuki-procurer';

module.exports = YasukiProcurer;
