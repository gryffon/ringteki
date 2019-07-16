const ProvinceCard = require('../../provincecard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UntamedSteppe extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Turn an unbroken province facedown',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: CardTypes.Province,
                controller: Players.Any,
                cardCondition: (card, context) => !card.isBroken && card !== context.source,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

UntamedSteppe.id = 'untamed-steppe';

module.exports = UntamedSteppe;

