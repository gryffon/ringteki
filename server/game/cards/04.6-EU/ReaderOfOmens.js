const DrawCard = require('../../drawcard.js');

class ReaderOfOmens extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.air.isConsideredClaimed(context.player) ||
                this.game.rings.void.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}

ReaderOfOmens.id = 'reader-of-omens';

module.exports = ReaderOfOmens;
