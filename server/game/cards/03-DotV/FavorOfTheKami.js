const DrawCard = require('../../drawcard.js');

class FavorOfTheKami extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.whileAttached({
            effect: [
                ability.effects.modifyGlory(1)
            ]
        });
    }
}

FavorOfTheKami.id = 'favor-of-the-kami'; // This is a guess at what the id might be - please check it!!!

module.exports = FavorOfTheKami;
