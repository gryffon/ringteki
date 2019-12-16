const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class Ichiro extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: Players.Any,
            match: card => card.getType() === CardTypes.Character && card.attachments.size() > 0,
            effect: [
                ability.effects.cardCannot('honor'),
                ability.effects.cardCannot('dishonor')
            ]
        });
    }
}

Ichiro.id = 'ichiro';

module.exports = Ichiro;

