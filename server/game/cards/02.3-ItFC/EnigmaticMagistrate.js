const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class EnigmaticMagistrate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: card => card.getCost() === 0 || card.getCost() && card.getCost() % 2 === 0,
            targetController: Players.Any,
            effect: ability.effects.cardCannot('countForResolution')
        });
    }
}

EnigmaticMagistrate.id = 'enigmatic-magistrate';

module.exports = EnigmaticMagistrate;
