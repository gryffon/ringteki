const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class YogoHiroue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.moveToConflict(),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: event => event.conflict.winner === context.player
                            },
                            gameAction: AbilityDsl.actions.menuPrompt({
                                activePromptTitle: 'Dishonor ' + context.target.name + '?',
                                choices: ['Yes', 'No'],
                                choiceHandler: (choice, displayMessage) => {
                                    if(displayMessage && choice === 'Yes') {
                                        context.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', context.player, context.target, context.source);
                                    }
                                    return { target: (choice === 'Yes' ? context.target : []) };
                                },
                                gameAction: AbilityDsl.actions.dishonor()
                            })
                        })
                    }))
                ])
            },
            effect: 'move {0} into the conflict - they may choose to dishonor it if they win the conflict'
        });
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
