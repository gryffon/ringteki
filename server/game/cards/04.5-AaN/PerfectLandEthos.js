const DrawCard = require('../../drawcard.js');

class PerfectLandEthos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: ability.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInPlay(card => card.isHonored || card.isDishonored).map(card => card.personalHonor)
            }))
        });
    }
}

PerfectLandEthos.id = 'perfect-land-ethos';

module.exports = PerfectLandEthos;
