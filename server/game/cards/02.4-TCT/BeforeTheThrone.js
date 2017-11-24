const ProvinceCard = require('../../provincecard.js');

class BeforeTheThrone extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.interrupt({
            title: 'Take 2 honor',
            when: {
                onBreakProvince: event => event.province === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to take 2 honor', this.controller, this);
                this.game.transferHonor(this.game.getOtherPlayer(this.controller), this.controller, 2);
            }
        });
    }
}

BeforeTheThrone.id = 'before-the-throne'

module.exports = BeforeTheThrone;
