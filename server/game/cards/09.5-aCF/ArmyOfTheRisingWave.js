const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ArmyOfTheRisingWave extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place one fate on each unclaimed ring',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(() => ({
                target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed())
            }))
        });
    }
}

ArmyOfTheRisingWave.id = 'army-of-the-rising-wave';

module.exports = ArmyOfTheRisingWave;
