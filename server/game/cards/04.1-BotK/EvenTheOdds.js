const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class EvenTheOdds extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character to the conflict',
            condition: context => this.game.isDuringConflict() && this.game.currentConflict.hasMoreParticipants(context.player.opponent),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [
                    ability.actions.moveToConflict(),
                    ability.actions.honor(context => ({ target: context.target.hasTrait('commander') ? context.target : [] }))
                ]
            }
        });
    }
}

EvenTheOdds.id = 'even-the-odds';

module.exports = EvenTheOdds;
