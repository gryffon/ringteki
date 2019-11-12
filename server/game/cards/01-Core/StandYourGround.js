const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class StandYourGround extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            },
            effect: 'to discard {1}\'s {2} and prevent them from leaving play',
            effectArgs: context => [context.event.card, context.event.card.personalHonor],
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.discardStatusToken({ target: context.event.card.personalHonor })
            }))
        });
    }
}

StandYourGround.id = 'stand-your-ground';

module.exports = StandYourGround;
