const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class BayushiKachiko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: context => this.game.isDuringConflict('political') && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.politicalSkill < context.source.politicalSkill,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.menuPrompt(context => ({
                        activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                        choices: ['Yes', 'No'],
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage && choice === 'Yes') {
                                context.game.addMessage('{0} chooses to bow {1} due to {2}\'s ability', context.player, context.target, context.source);
                            }
                            return { target: (choice === 'Yes' ? context.target : []) };
                        },
                        gameAction: AbilityDsl.actions.bow()
                    }))
                ])
            }
        });
    }
}

BayushiKachiko.id = 'bayushi-kachiko';

module.exports = BayushiKachiko;
