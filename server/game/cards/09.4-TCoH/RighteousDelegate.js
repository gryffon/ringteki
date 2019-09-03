import { Durations } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class RighteousDelegate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'increase the skill of each non-bushi and decrease the skill of each bushi',
            condition: context => context.source.isParticipating(),
            effect: 'give all participating bushi characters -1{1} \/ -1{2} and give all participating non-bushi characters +1{1} \/ +1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: this.game.currentConflict.getCharacters(context.player)
                        .filter(card => !card.hasTrait('bushi'))
                        .concat(this.game.currentConflict.getCharacters(context.player.opponent)
                            .filter(card => !card.hasTrait('bushi'))
                        ),
                    effect: AbilityDsl.effects.modifyBothSkills(1),
                    duration: Durations.UntilEndOfConflict
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: this.game.currentConflict.getCharacters(context.player)
                        .filter(card => card.hasTrait('bushi'))
                        .concat(this.game.currentConflict.getCharacters(context.player.opponent)
                            .filter(card => card.hasTrait('bushi'))
                        ),
                    effect: AbilityDsl.effects.modifyBothSkills(-1),
                    duration: Durations.UntilEndOfConflict
                }))
            ])
        });
    }
}

RighteousDelegate.id = 'righteous-delegate';

module.exports = RighteousDelegate;

