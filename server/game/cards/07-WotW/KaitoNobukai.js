const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class KaitoNobukai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow each participating characters',
            cost: ability.costs.sacrificeSelf(),
            condition: context => context.source.isParticipating(),
            gameAction: [
                ability.actions.bow(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character && card.isParticipating())
                })),
                ability.actions.cardLastingEffect(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character),
                    effect: ability.effects.cardCannot('moveToConflict')
                }))]
        });
    }
}


KaitoNobukai.id = 'kaito-nobukai';

module.exports = KaitoNobukai;
