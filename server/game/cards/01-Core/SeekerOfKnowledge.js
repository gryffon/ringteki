const DrawCard = require('../../drawcard.js');
const { Elements } = require('../../Constants');

class SeekerOfKnowledge extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addElementAsAttacker(Elements.Air)
        });
    }
}

SeekerOfKnowledge.id = 'seeker-of-knowledge';

module.exports = SeekerOfKnowledge;
