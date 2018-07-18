const DrawCard = require('../../drawcard.js');

class AwakenedTsukumogami extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: Object.keys(this.game.rings).map(element =>
                ability.effects.alternateFatePool(card => card.isConflict && card.hasTrait(element) && this.game.rings[element])
            )
        });
    }
}

AwakenedTsukumogami.id = 'awakened-tsukumogami';

module.exports = AwakenedTsukumogami;
