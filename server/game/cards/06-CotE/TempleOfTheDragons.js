const ProvinceCard = require('../../provincecard.js');

class TempleOfTheDragons extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve the ring as if you were the attacker',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}

TempleOfTheDragons.id = 'temple-of-the-dragons';

module.exports = TempleOfTheDragons;
