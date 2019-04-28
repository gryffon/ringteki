const DrawCard = require('../../drawcard.js');

class KakitaFavorite extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                this.game.currentDuel &&
                this.game.currentDuel.isInvolvedInAnyDuel(context.source),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
    }
}

KakitaFavorite.id = 'kakita-favorite';

module.exports = KakitaFavorite;
