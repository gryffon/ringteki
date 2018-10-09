const DrawCard = require('../../drawcard.js');

class SoshiAoi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +1/-0 and the Bushi trait or +0/+1 and the Courtier trait',
            cost: ability.costs.payHonor(1),
            target: {
                cardType: 'character',
                controller: 'self',
                
    }
}

SoshiAoi.id = 'soshi-aoi';

module.exports = SoshiAoi;
