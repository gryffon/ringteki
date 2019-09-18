const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class WrittenInTheStars extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place or take fate from rings',
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Place one fate on each unclaimed ring with no fate': AbilityDsl.actions.placeFateOnRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate === 0)
                    })),
                    'Remove one fate from each unclaimed ring': AbilityDsl.actions.takeFateFromRing(() => ({
                        target: Object.values(this.game.rings).filter(ring => ring.isUnclaimed() && ring.fate > 0),
                        removeOnly: true
                    }))
                }
            }
        });
    }
}

WrittenInTheStars.id = 'written-in-the-stars';

module.exports = WrittenInTheStars;
