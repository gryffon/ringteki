const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');

class SoshiShiori extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction ({
            title: 'Make opponent lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            target: {
                mode: TargetModes.Select,
                activePromptTitle:'Choose a player to lose 1 honor',
                choices: {
                    'Me': ability.actions.loseHonor(context => ({ target: context.player })),
                    'Opponent': ability.actions.loseHonor()
                }
            }
        });
    }
}

SoshiShiori.id = 'soshi-shiori';
module.exports = SoshiShiori;
