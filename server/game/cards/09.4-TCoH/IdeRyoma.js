const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IdeRyoma extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose one character to bow and one to ready',
            condition: (context) => context.source.isParticipating(),
            targets: {
                toBeBowed: {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: card => card.bowed === false
                },
                toBeReadied: {
                    dependsOn: 'toBeBowed',
                    activePromptTitle: 'Choose a character to readied controlled by the same player',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) => {
                        let readiedChar = context.targets.toBeBowed;
                        if(card.controller === readiedChar.controller) {
                            if(readiedChar.isFaction('unicorn') && !card.isFaction('unicorn')) {
                                return true;
                            } else if(!readiedChar.isFaction('unicorn') && card.isFaction('unicorn')) {
                                return true;
                            }
                            return false;
                        }
                        return false;
                    },
                    gameAction: AbilityDsl.actions.menuPrompt(context => {
                        return {
                            activePromptTitle: 'choose a character to bow',
                            choices: [context.targets.toBeReadied, context.targets.toBeBowed],
                        };
                    })
                }
            },
            effect: 'readies {1} and bows {2}',
            effectArgs: context => [context.targets.toBeReadied, context.targets.toBeBowed]
        });
    }
}

IdeRyoma.id = 'ide-ryoma';

module.exports = IdeRyoma;
