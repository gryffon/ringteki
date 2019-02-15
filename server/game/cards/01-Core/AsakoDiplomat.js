const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class AsakoDiplomat extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardTypes.Character,
                gameAction: ability.actions.chooseAction({
                    messages: {
                        'Honor this character': '{0} chooses to honor {1}',
                        'Dishonor this character': '{0} chooses to honor {1}'
                    },
                    choices: {
                        'Honor this character': ability.actions.honor(),
                        'Dishonor this character': ability.actions.dishonor()
                    }
                })
            }
        });
    }
}

AsakoDiplomat.id = 'asako-diplomat';

module.exports = AsakoDiplomat;
