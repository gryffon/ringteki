const DrawCard = require('../../drawcard.js');

class ProdigyOfTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready this character'
            condition: () => this.bowed && this.game.rings['water'].claimed,
            handler: () => {
                this.game.addMessage('{0} readies {1} using its ability', this.controller, this);
                this.controller.readyCard(this);
            }
        });
    }
}

ProdigyOfTheWaves.id = 'prodigy-of-the-waves'; // This is a guess at what the id might be - please check it!!!

module.exports = ProdigyOfTheWaves;
