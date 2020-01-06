const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class VineTattoo extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: [
                AbilityDsl.effects.addTrait('tattooed'),
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'equalOrMoreExpensiveCharacterTriggeredAbilities',
                    source: this
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'equalOrMoreExpensiveCharacterKeywords',
                    source: this
                })
            ]
        });
    }
}

VineTattoo.id = 'vine-tattoo';

module.exports = VineTattoo;
