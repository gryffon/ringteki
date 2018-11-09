const DrawCard = require('../../drawcard.js');

class PerfectLandEthos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: ability.actions.discardStatusToken(() => ({
                target: this.game.findAnyCardsInPlay(card => card.isHonored || card.isDishonored)
            }))
        });
    }
}

PerfectLandEthos.id = 'perfect-land-ethos';

module.exports = PerfectLandEthos;
