const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class SoulBeyondReproach extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character, then honor it again',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'honor {0}, then honor it again'
        });
    }
}

SoulBeyondReproach.id = 'soul-beyond-reproach';

module.exports = SoulBeyondReproach;
