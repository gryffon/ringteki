import { CardTypes, Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class KitsuMotso extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            condition: context => context.game.isDuringConflict()
                && context.source.isParticipating()
                && context.player.hand.size() < context.player.opponent.hand.size(),
            target: {
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to move in',
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

KitsuMotso.id = 'kitsu-motso';

module.exports = KitsuMotso;
