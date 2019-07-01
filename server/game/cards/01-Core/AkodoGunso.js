const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AkodoGunso extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Refill province faceup',
            when: {
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source &&
                    [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(event.originalLocation)
            },
            gameAction: AbilityDsl.actions.refillFaceup(context => ({ location: context.event.originalLocation }))
        });
    }
}

AkodoGunso.id = 'akodo-gunso';

module.exports = AkodoGunso;
