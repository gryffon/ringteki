const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class TheFiresOfJustice extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove fate or move fate to a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military'
            },
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    player: Players.Opponent,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    choices: {
                        'Remove all fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character, amount: context.targets.character.fate })),
                        'Move fate to character': AbilityDsl.actions.menuPrompt(context => ({
                            activePromptTitle: 'Select fate amount:',
                            choices: Array.from(Array(context.player.opponent.fate), (x, i) => (i + 1).toString()),
                            choiceHandler: (choice, displayMessage) => {
                                if(displayMessage) {
                                    this.game.addMessage('{0} chooses to move {1} fate from {2}\'s pool to {3}', context.player, choice, context.player.opponent, context.targets.character);
                                }
                                return { target: context.targets.character, amount: parseInt(choice) };
                            },
                            gameAction: AbilityDsl.actions.placeFate({ origin: context.player.opponent })
                        }))
                    }
                }
            },
            effect: '{1} {2}',
            effectArgs: context => [context.selects.select.choice === 'Remove all fate' ? 'remove all fate from' : 'place fate on', context.targets.character]
        });
    }
}

TheFiresOfJustice.id = 'the-fires-of-justice';

module.exports = TheFiresOfJustice;
