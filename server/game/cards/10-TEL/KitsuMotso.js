import { CardTypes, Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class KitsuMotso extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            condition: context => context.source.isParticipating()
                && context.player.opponent
                && context.player.hand.size() < context.player.opponent.hand.size(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

KitsuMotso.id = 'kitsu-motso';

module.exports = KitsuMotso;
