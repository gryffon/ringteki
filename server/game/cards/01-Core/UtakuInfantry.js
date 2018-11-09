const DrawCard = require('../../drawcard.js');

class UtakuInfantry extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: ability.effects.modifyBothSkills(card => this.getNoOfUnicornCharacters(card.controller))
        });
    }

    getNoOfUnicornCharacters(player) {
        return player.cardsInPlay.filter(card => card.isParticipating() && card.isFaction('unicorn')).length;
    }
}

UtakuInfantry.id = 'utaku-infantry';

module.exports = UtakuInfantry;

