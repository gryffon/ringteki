const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class HonedNodachi extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction({
            title: 'Remove a fate from attached character and force opponent to discard a participating character',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller &&
                                                   event.conflict.conflictType === 'military'
            },
            cost: ability.costs.removeFateFromParent(),
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

HonedNodachi.id = 'honed-nodachi';

module.exports = HonedNodachi;
