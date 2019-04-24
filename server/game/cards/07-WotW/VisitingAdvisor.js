const DrawCard = require('../../drawcard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class VisitingAdvisor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send this and up to 1 other character home',
            condition: context => context.source.isParticipating(),
            target: {
                controller: Players.Self,
                cardType: CardTypes.Character,
                optional: true,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.sendHome()
            },
            gameAction: AbilityDsl.actions.sendHome(context => ({ target: context.source })),
            effect: 'send {0}{1}{2} home',
            effectArgs: (context) => context.target.length === 0 ? [context.source] : [' and ', context.source]
        });
    }
}

VisitingAdvisor.id = 'visiting-advisor';

module.exports = VisitingAdvisor;
