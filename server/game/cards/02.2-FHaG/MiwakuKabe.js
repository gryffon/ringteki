const DrawCard = require('../../drawcard.js');

class MiwakuKabe extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Shuffle this into deck',
            when: {
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            },
            effect: 'shuffle itself back into the dynasty deck',
            gameAction: ability.actions.returnToDeck({ shuffle: true })
        });
    }
}

MiwakuKabe.id = 'miwaku-kabe';

module.exports = MiwakuKabe;
