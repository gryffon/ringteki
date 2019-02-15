const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class StandYourGround extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.discardStatusToken()
            })
        });
    }
}

StandYourGround.id = 'stand-your-ground';

module.exports = StandYourGround;
