const StrongholdCard = require('../../strongholdcard.js');
const { Players, CardTypes } = require('../../Constants');

class GoldenPlainsOutpost extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a cavalry character to the conflict',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry'),
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

GoldenPlainsOutpost.id = 'golden-plains-outpost';

module.exports = GoldenPlainsOutpost;
