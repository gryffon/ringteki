const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class FruitfulRespite extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain fate',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardTypes.Character && !card.bowed)
            },
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}

FruitfulRespite.id = 'fruitful-respite';

module.exports = FruitfulRespite;
