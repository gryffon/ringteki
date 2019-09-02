const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class IntoTheForbiddenCity extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard an attachment',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.isAttacking(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}

IntoTheForbiddenCity.id = 'into-the-forbidden-city';

module.exports = IntoTheForbiddenCity;
