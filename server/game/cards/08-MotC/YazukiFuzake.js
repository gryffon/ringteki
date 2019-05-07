const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class YasukiFuzake extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Discard the status token on up to two characters',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            targets: {
                first: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                        target: context.targets.first.personalHonor
                    }))
                },
                second: {
                    dependsOn: 'first',
                    cardType: CardTypes.Character,
                    optional: true,
                    cardCondition: (card, context) => card.controller !== context.targets.first.controller,
                    gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                        target: !Array.isArray(context.targets.second) && context.targets.second.personalHonor
                    }))
                }
            },
            effect: 'discard the status token from {1}{2}{3}',
            effectArgs: context => [context.targets.first, context.targets.second[0] ? '' : ' and ', context.targets.second]
        });
    }
}

YasukiFuzake.id = 'yasuki-fuzake';

module.exports = YasukiFuzake;
