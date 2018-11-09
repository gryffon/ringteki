const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class FromTheShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a shinobi character into the conflict from hand or a province, dishonored',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi'),
                gameAction: ability.actions.putIntoConflict({ status: 'dishonored' })
            }
        });
    }

    canPlay(context, type) {
        return context.player.opponent && context.player.honor < context.player.opponent.honor && super.canPlay(context, type);
    }
}

FromTheShadows.id = 'from-the-shadows';

module.exports = FromTheShadows;
