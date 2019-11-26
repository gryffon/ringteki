const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class MotoAriq extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a ready character to the conflict',
            condition: context => context.source.isParticipating()
                && context.player.opponent
                && context.player.opponent.honor > context.player.honor,
            target: {
                player: Players.Opponent,
                cardCondition: card => !card.bowed,
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to move to the conflict',
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

MotoAriq.id = 'moto-ariq';

module.exports = MotoAriq;
