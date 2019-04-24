const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KaitoNobukai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow each participating characters',
            cost: AbilityDsl.costs.sacrificeSelf(),
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.bow(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character && card.isParticipating())
                })),
                AbilityDsl.actions.cardLastingEffect(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character),
                    effect: AbilityDsl.effects.cardCannot('moveToConflict')
                }))
            ])
        });
    }
}


KaitoNobukai.id = 'kaito-nobukai';

module.exports = KaitoNobukai;
