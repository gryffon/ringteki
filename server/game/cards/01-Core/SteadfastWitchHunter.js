const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class SteadfastWitchHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready character',
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardTypes.Character,
                gameAction: ability.actions.ready()
            }
        });
    }
}

SteadfastWitchHunter.id = 'steadfast-witch-hunter';

module.exports = SteadfastWitchHunter;
