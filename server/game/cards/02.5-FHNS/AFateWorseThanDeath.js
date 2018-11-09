const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');

class AFateWorseThanDeath extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow, move home, dishonor, remove a fate and blank a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    ability.actions.bow(),
                    ability.actions.dishonor(),
                    ability.actions.removeFate(),
                    ability.actions.sendHome(),
                    ability.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfPhase,
                        effect: ability.effects.blank()
                    })
                ]
            },
            effect: 'bow, dishonor, blank, move home, and remove a fate from {0}'
        });
    }
}

AFateWorseThanDeath.id = 'a-fate-worse-than-death';

module.exports = AFateWorseThanDeath;
