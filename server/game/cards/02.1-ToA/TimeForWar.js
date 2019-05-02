const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const CardSelector = require('../../CardSelector');
const { Locations, Players, CardTypes } = require('../../Constants');

class TimeForWar extends DrawCard {
    setupCardAbilities() {
        const attachAction = AbilityDsl.actions.attach();
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'political'
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    selector: CardSelector.for({
                        activePromptTitle: 'Choose a weapon attachment',
                        cardType: CardTypes.Attachment,
                        location: [Locations.ConflictDiscardPile, Locations.Hand],
                        controller: Players.Self,
                        cardCondition: card => card.costLessThan(4) && card.hasTrait('weapon') && attachAction.canAffect(context.target, context, { attachment: card })
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (card, player) => [player, card, context.target],
                    subActionProperties: card => ({ attachment: card }),
                    gameAction: attachAction
                }))
            },
            effect: 'attach a weapon to {0}'
        });
    }
}

TimeForWar.id = 'time-for-war';

module.exports = TimeForWar;
