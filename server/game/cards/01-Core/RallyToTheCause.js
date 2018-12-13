const ProvinceCard = require('../../provincecard.js');

class RallyToTheCause extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the conflict type',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            effect: 'switch the conflict type',
            handler: () => this.game.currentConflict.switchType()
        });
    }
}

RallyToTheCause.id = 'rally-to-the-cause';

module.exports = RallyToTheCause;
