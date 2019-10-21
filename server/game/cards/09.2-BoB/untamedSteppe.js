const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Players, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UntamedSteppe extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Turn another unbroken province facedown',
            target: {
                cardType: CardTypes.Province,
                controller: Players.Any,
                location: Locations.Provinces,
                cardCondition: (card, context) => !card.isBroken && card !== context.source,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

UntamedSteppe.id = 'untamed-steppe';

module.exports = UntamedSteppe;

