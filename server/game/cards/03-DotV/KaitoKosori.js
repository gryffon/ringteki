const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class KaitoKosori extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                context.player.cardsInPlay.any(card => card.isParticipating()) &&
                this.game.currentConflict.hasElement('air') && !context.source.isParticipating(),
            effect: AbilityDsl.effects.contributeToConflict((card, context) => context.player)
        });
    }
}

KaitoKosori.id = 'kaito-kosori';

module.exports = KaitoKosori;
