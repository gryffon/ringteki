const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class AsahinaStoryteller extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isHonored && card.isFaction('crane'),
            effect: ability.effects.addKeyword('sincerity')
        });
    }
}

AsahinaStoryteller.id = 'asahina-storyteller';

module.exports = AsahinaStoryteller;

