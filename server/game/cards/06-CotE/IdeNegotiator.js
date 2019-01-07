const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class IdeNegotiator extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Modify honor dial',
            effect: 'modify their honor dial',
            when: {
                onHonorDialsRevealed: () => true
            },
            gameAction: AbilityDsl.actions.chooseAction(context => ({
                target: context.player,
                choices: {
                    'Increase bid by 1': AbilityDsl.actions.setHonorDial({ value: context.player.honorBid + 1 }),
                    'Decrease bid by 1': AbilityDsl.actions.setHonorDial({ value: context.player.honorBid - 1 })
                },
                messages: {
                    'Increase bid by 1': '{0} chooses to increase their honor bid by 1',
                    'Decrease bid by 1': '{0} chooses to decrease their honor bid by 1'
                }
            }))
        });
    }
}

IdeNegotiator.id = 'ide-negotiator';

module.exports = IdeNegotiator;
