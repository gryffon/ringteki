import { Durations } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RighteousDelegate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Weaken bushi, empower non-bushi',
            condition: context => context.source.isParticipating(),
            effect: 'give all participating bushi characters -1{1} / -1{2} and give all participating non-bushi characters +1{1} / +1{2}',
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

