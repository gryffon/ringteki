const DrawCard = require('../../drawcard.js');

class Ofushukai extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.grantedAbilityLimits = {};
        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: ability.effects.gainAbility('action', {
                title: 'Send a character home',
                condition: context => context.source.parent.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: 'character',
                    controller: 'any',
                    cardCondition: card => card.isParticipating(),
                    gameAction: [
                        ability.actions.sendHome(),
                        ability.actions.cardLastingEffect({
                            duration: 'untilEndOfPhase',
                            effect: ability.effects.cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }

    canAttach(card, context) {
        return context.source.isUnique() && context.source.getPrintedFaction() === 'phoenix' ? super.canAttach(card, context) : false;
    }
}

Ofushukai.id = 'ofushukai';

module.exports = Ofushukai;
