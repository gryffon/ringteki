const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class Rebuild extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a holding into play from your discard',
            cost: ability.costs.shuffleIntoDeck({
                location: Locations.Provinces,
                cardCondition: card => card.controller.getProvinceCardInProvince(card.location) && !card.controller.getProvinceCardInProvince(card.location).isBroken
            }),
            target: {
                activePromptTitle: 'Choose a holding to put into the province',
                cardType: CardTypes.Holding,
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                gameAction: ability.actions.moveCard(context => ({
                    destination: context.costs.moveStateWhenChosen ? context.costs.moveStateWhenChosen.location : Locations.ProvinceOne,
                    facedown: false
                }))
            },
            cannotTargetFirst: true,
            cannotBeMirrored: true,
            effect: 'replace it with {0}'
        });
    }
}

Rebuild.id = 'rebuild';

module.exports = Rebuild;
