const DrawCard = require('../../drawcard.js');

class YoungHarrier extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent other characters from being dishonored',
            cost: ability.costs.dishonorSelf(),
            effect: 'prevent Crane characters from being dishonored this phase',
            handler: context => context.player.cardsInPlay.each(card => {
                if(card.isFaction('crane')) {
                    this.untilEndOfPhase(ability => ({
                        match: card,
                        effect: ability.effects.cardCannot('dishonor')
                    }));
                }
            })
        });
    }
}

YoungHarrier.id = 'young-harrier';

module.exports = YoungHarrier;
