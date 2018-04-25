const StrongholdCard = require('../../strongholdcard.js');

class GoldenPlainsOutpost extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a cavalry character to the conflict',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: (card, context) => card.hasTrait('cavalry') && card.controller === context.player
            }
        });
    }
}

GoldenPlainsOutpost.id = 'golden-plains-outpost';

module.exports = GoldenPlainsOutpost;
