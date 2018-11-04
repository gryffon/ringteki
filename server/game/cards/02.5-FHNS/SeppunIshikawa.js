const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

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
                (['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location) &&
                 card.type === 'holding'))) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}

SeppunIshikawa.id = 'seppun-ishikawa';

module.exports = SeppunIshikawa;
