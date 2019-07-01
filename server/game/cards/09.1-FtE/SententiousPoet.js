const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Stages } = require('../../Constants');

class SententiousPoet extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSpendFate: (event, context) =>
                    event.context.player === context.source.controller.opponent &&
                    event.amount > 0 &&
                    event.context.stage === Stages.Cost &&
                    context.source.isParticipating(),
                onMoveFate: (event, context) =>
                    event.context.source.type === CardTypes.Event &&
                    event.origin === context.source.controller.opponent &&
                    event.fate > 0 &&
                    context.source.isParticipating() &&
                    event.context.stage === Stages.Cost &&
                    event.recipient.type === 'ring'
            },
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}

SententiousPoet.id = 'sententious-poet';

module.exports = SententiousPoet;
