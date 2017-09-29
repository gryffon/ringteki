const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class CloudTheMind extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank
        });
    }
        
    //Need to control a Shugenja
    canBePlayed() {
        if(!_.any(this.controller.cardsInPlay, card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }
        
        return super.canBePlayed();
    }
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;


