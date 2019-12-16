const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class Ichiro extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            match: card => card.getType() === CardTypes.Character && card.attachments.size() > 0,
            effect: [
                AbilityDsl.effects.cardCannot('honor'),
                AbilityDsl.effects.cardCannot('dishonor')
            ]
        });
    }
}

Ichiro.id = 'ichiro';

module.exports = Ichiro;

