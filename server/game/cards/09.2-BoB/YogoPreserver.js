const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class YogoPreserver extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isDishonored,
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });
    }
}

YogoPreserver.id = 'yogo-preserver';

module.exports = YogoPreserver;

