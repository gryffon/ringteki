const DrawCard = require('../../drawcard.js');
const { CardTypes, Players } = require('../../Constants');

class TheFiresOfJustice extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove fate or move fate to a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military'
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.chooseAction(context => ({
                    messages: {
                        'Remove all fate': '{0} chooses to remove all fate from {1}'
                    },
                    choices: {
                        'Remove all fate': ability.actions.removeFate({ amount: context.target.fate }),
                        'Move fate to character': ability.actions.placeFate({
                            origin: context.player.opponent,
                            amount: context.player.opponent.fate,
                            promptForAmount: true
                        })
                    }
                }))
            }
        });
    }
}

TheFiresOfJustice.id = 'the-fires-of-justice';

module.exports = TheFiresOfJustice;
