const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IdeRyoma extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose one character to bow and one to ready',
            condition: (context) => context.source.isParticipating(),
            targets: {
                unicorn: {
                    activePromptTitle: 'Choose a unicorn character',
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isFaction('unicorn')
                },
                nonunicorn: {
                    activePromptTitle: 'Choose a non-unicorn character',
                    dependsOn: 'unicorn',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        !card.isFaction('unicorn') &&
                        card.controller === context.targets.unicorn.controller,
                    gameAction: AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a character to bow',
                        cardCondition: card => Object.values(context.targets).includes(card),
                        gameAction: AbilityDsl.actions.bow()
                    }))
                }
            },
            then: context => ({
                gameAction: AbilityDsl.actions.ready(() => ({
                    target: Object.values(context.targets).filter(card => context.events.every(event => event.card !== card))
                }))
            })
        });
    }
}

IdeRyoma.id = 'ide-ryoma';

module.exports = IdeRyoma;
