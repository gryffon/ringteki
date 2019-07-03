const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AsahinaStoryteller extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isHonored && card.isFaction('crane'),
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });
    }
}

AsahinaStoryteller.id = 'asahina-storyteller';

module.exports = AsahinaStoryteller;

