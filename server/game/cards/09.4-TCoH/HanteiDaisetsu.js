import { CardTypes, Durations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class HanteiDaisetsu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Blank a participating character',
            condition: context => context.source.isParticipating() && context.game.isDuringConflict('political'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.blank(),
                    duration: Durations.UntilEndOfConflict
                })
            },
            effect: 'treat {1} as if its text box were blank until the end of the conflict',
            effectArgs: context => [context.target]
        });
    }
}

HanteiDaisetsu.id = 'hantei-daisetsu';

module.exports = HanteiDaisetsu;
