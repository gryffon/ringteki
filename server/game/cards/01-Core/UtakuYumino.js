const DrawCard = require('../../drawcard.js');

class UtakuYumino extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card for +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.discardFromHand(),
            effect: 'give {1} +2/+2',
            untilEndOfConflict: context => ({
                match: context.source,
                effect: [
                    ability.effects.modifyMilitarySkill(2),
                    ability.effects.modifyPoliticalSkill(2)
                ]
            }),
            limit: ability.limit.perConflict(1)
        });
    }
}

UtakuYumino.id = 'utaku-yumino';

module.exports = UtakuYumino;
