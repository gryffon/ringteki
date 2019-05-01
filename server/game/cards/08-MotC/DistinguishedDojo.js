const DrawCard = require('../../drawcard');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class DistinguishedDojo extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token',
            when: {
                afterDuel: (event, context) => event.winner && event.winner.controller === context.source.controller
            },
            limit: AbilityDsl.limit.perRound(3),
            gameAction: AbilityDsl.actions.addToken(),
            then: context => {
                let tokenCount = context.source.getTokenCount('honor');
                return {
                    target: {
                        mode: TargetModes.Select,
                        activePromptTitle: 'Sacrifice ' + context.source.name + '?',
                        choices: {
                            'Yes': AbilityDsl.actions.sacrifice({ target: context.source }),
                            'No': () => true
                        }
                    },
                    message: '{0} chooses {3}to sacrifice {1}',
                    messageArgs: context => context.select === 'No' ? 'not ' : '',
                    then: {
                        gameAction: AbilityDsl.actions.gainHonor({ amount: tokenCount + 1 }),
                        message: '{0} uses {1} to gain {3} honor',
                        messageArgs: [tokenCount + 1]
                    }
                };
            }
        });
    }
}

DistinguishedDojo.id = 'distinguished-dojo';

module.exports = DistinguishedDojo;
