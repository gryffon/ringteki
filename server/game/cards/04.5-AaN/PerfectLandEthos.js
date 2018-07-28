const DrawCard = require('../../drawcard.js');

class PerfectLandEthos extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: [
                ability.actions.dishonor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.isHonored)
                })),
                ability.actions.honor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.isDishonored)
                }))
            ]
        });
    }
}

PerfectLandEthos.id = 'perfect-land-ethos'; // This is a guess at what the id might be - please check it!!!

module.exports = PerfectLandEthos;
