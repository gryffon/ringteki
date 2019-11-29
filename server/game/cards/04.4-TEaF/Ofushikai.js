const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes, AbilityTypes } = require('../../Constants');

class Ofushukai extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'phoenix'
        });

        this.grantedAbilityLimits = {};
        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: ability.effects.gainAbility(AbilityTypes.Action, {
                title: 'Send a character home',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isParticipating(),
                    gameAction: [
                        ability.actions.sendHome(),
                        ability.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfPhase,
                            effect: ability.effects.cannotParticipateAsAttacker()
                        })
                    ]
                }
            })
        });
    }
}

Ofushukai.id = 'ofushikai';

module.exports = Ofushukai;
