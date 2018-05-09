const DrawCard = require('../../drawcard.js');

class AkodoToshiro extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain +5/+0 and provinces can\'t be broken',
            condition: context => context.source.isAttacking(),
            effect: 'gain +5/+0 - provinces cannot be broken during this conflict',
            handler: context => {
                context.source.untilEndOfConflict(ability => ({
                    match: context.source,
                    effect: ability.effects.modifyMilitarySkill(5)
                }));
                context.source.untilEndOfConflict(ability => ({
                    match: card => card.isProvince,
                    targetLocation: 'province',
                    targetController: 'any',
                    effect: ability.effects.cardCannot('break')
                }));
                context.source.delayedEffect({
                    target: context.source,
                    context: context,
                    when: {
                        onConflictFinished: () => !context.player.cardsInPlay.any(card => card.hasTrait('commander'))
                    },
                    message: '{0} is discarded due to his delayed effect',
                    gameAction: 'discardFromPlay'
                });
            }
        });
    }
}

AkodoToshiro.id = 'akodo-toshiro';

module.exports = AkodoToshiro;
