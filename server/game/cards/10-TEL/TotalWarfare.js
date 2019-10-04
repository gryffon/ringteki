import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const DrawCard = require('../../drawcard.js');

class TotalWarfare extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Loser sacrifices a character',
            when: {
                afterConflict: (event, context) => event.conflict.loser && context.source.isConflictProvince()
            },
            target: {
                cardType: CardTypes.Character,
                player: context => context.source.controller === this.game.currentConflict.loser ? Players.Self : Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.sacrifice()
            }
        });
    }
    canAttach(province) {
        return province && province.type === 'province';
    }
    canPlayOn(source) {
        return source && source.getType() === 'province' && this.getType() === CardTypes.Attachment;
    }
    mustAttachToProvince() {
        return true;
    }
}

TotalWarfare.id = 'total-warfare';

module.exports = TotalWarfare;

