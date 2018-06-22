const DrawCard = require('../../drawcard.js');

class FeralNingyo extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Put into play',
            condition: this.game.isDuringConflict() && this.game.currentConflict.hasElement('water'),
            //cost: ability.costs.putSelfIntoPlay(),
            location: 'hand',
            gameAction: ability.actions.putIntoConflict()
        });
    }
}

FeralNingyo.id = 'feral-ningyo'; // This is a guess at what the id might be - please check it!!!

module.exports = FeralNingyo;
