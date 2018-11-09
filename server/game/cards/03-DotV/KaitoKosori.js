const DrawCard = require('../../drawcard.js');

class KaitoKosori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                context.player.cardsInPlay.any(card => card.isParticipating()) &&
                this.game.currentConflict.hasElement('air') && !context.source.isParticipating(),
            effect: ability.effects.contributeToConflict((conflict, context) => context.source)
        });
    }
}

KaitoKosori.id = 'kaito-kosori';

module.exports = KaitoKosori;
