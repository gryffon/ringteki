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

    canPlayOn(source) {
        return source && source.getType() === 'province' && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent, context) { // eslint-disable-line no-unused-vars
        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

TotalWarfare.id = 'total-warfare';

module.exports = TotalWarfare;

