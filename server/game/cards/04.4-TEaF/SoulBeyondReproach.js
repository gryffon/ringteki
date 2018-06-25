const DrawCard = require('../../drawcard.js');

class SoulBeyondReproach extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character, then honor it again',
            target: {
                cardType: 'character',
                controller: 'self',
                gameAction: [
                    ability.actions.honor(),
                    ability.actions.honor()
                ]
            },
            effect: 'honor {0}, then honor {0} again'
        });
    }
}

SoulBeyondReproach.id = 'soul-beyond-reproach';

module.exports = SoulBeyondReproach;
