const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IdeRyoma extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose one character to bow and one to ready',
            condition: (context) => context.source.isParticipating(),
            targets: {
                toBeReadied: {
                    activePromptTitle: 'Choose a character to ready',
                    cardType: CardTypes.Character,
                    controller: Players.Any
                },
                toBeBowed: {
                    dependsOn: 'toBeReadied',
                    activePromptTitle: 'Choose a character to bow controlled by the same player',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) => {
                        let bowedChar = context.targets.toBeReadied;
                        if(card.controller === bowedChar.controller) {
                            if(bowedChar.isFaction('unicorn') && !card.isFaction('unicorn')) {
                                return true;
                            } else if(!bowedChar.isFaction('unicorn') && card.isFaction('unicorn')) {
                                return true;
                            }
                            return false;
                        }
                        return false;
                    },
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.ready(context => ({ target: context.targets.toBeReadied })),
                        AbilityDsl.actions.bow()
                    ])
                }
            },
            effect: 'readies {1} and bows {2}',
            effectArgs: context => [context.targets.toBeReadied, context.targets.toBeBowed]
        });
    }
}

IdeRyoma.id = 'ide-ryoma';

module.exports = IdeRyoma;
