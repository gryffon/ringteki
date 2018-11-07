const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class MantraOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Make a monk untargetable by opponents\' card effects and draw a card',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('earth') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsCardEffects'
                    })
                })
            },
            effect: 'make {0} untargetable by opponents\' card effects and draw a card',
            gameAction: ability.actions.draw()
        });
    }
}

MantraOfEarth.id = 'mantra-of-earth';

module.exports = MantraOfEarth;
