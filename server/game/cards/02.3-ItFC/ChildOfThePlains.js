const DrawCard = require('../../drawcard.js');

class ChildOfThePlains extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Get first action',
            when: {
                onProvinceRevealed: event => event.conflict.isAttacking(this)
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to get the first action in this conflict', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    targetType: 'player',
                    targetController: 'opponent',
                    effect: ability.effects.playerCannot('takeFirstAction')
                }));
            }
        });
    }
}

ChildOfThePlains.id = 'child-of-the-plains'; // This is a guess at what the id might be - please check it!!!

module.exports = ChildOfThePlains;
