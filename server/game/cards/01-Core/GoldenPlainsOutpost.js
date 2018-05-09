const StrongholdCard = require('../../strongholdcard.js');

class GoldenPlainsOutpost extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a cavalry character to the conflict',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardCondition: (card, context) => card.hasTrait('cavalry') && card.controller === context.player,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

GoldenPlainsOutpost.id = 'golden-plains-outpost';

module.exports = GoldenPlainsOutpost;
