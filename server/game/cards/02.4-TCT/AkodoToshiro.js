const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class AkodoToshiro extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain +5/+0 and provinces can\'t be broken',
            condition: context => context.source.isAttacking(),
            effect: 'gain +5/+0 - provinces cannot be broken during this conflict',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(() => ({
                    target: this.game.provinceCards,
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.cardCannot('break')
                })),
                AbilityDsl.actions.cardLastingEffect({ effect: [
                    AbilityDsl.effects.modifyMilitarySkill(5),
                    AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: (event, context) => !context.player.cardsInPlay.any(card => card.hasTrait('commander'))
                        },
                        message: '{0} is discarded due to his delayed effect',
                        messageArgs: context => [context.source],
                        gameAction: AbilityDsl.actions.discardFromPlay()
                    })
                ]})
            ])
        });
    }
}

AkodoToshiro.id = 'akodo-toshiro';

module.exports = AkodoToshiro;
