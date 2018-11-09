const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

class SeppunIshikawa extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyBothSkills(card => this.getImperialCardsInPlay(card))
        });
    }

    getImperialCardsInPlay(source) {
        return this.game.allCards.reduce((sum, card) => {
            if(card !== source && card.controller === source.controller && card.hasTrait('imperial') && !card.facedown &&
                (card.location === Locations.PlayArea || (card.isProvince && !card.isBroken) ||
                ([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince].includes(card.location) &&
                 card.type === CardTypes.Holding))) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}

SeppunIshikawa.id = 'seppun-ishikawa';

module.exports = SeppunIshikawa;
