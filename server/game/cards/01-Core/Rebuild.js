const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class Rebuild extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a holding into play from your discard',
            cost: ability.costs.shuffleIntoDeck((card, context) =>
                [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince].includes(card.location) &&
                !context.player.getProvinceCardInProvince(card.location).isBroken
            ),
            target: {
                activePromptTitle: 'Choose a holding to put into the province',
                cardType: 'holding',
                location: Locations.DynastyDiscardPile,
                controller: 'self'
            },
            cannotTargetFirst: true,
            cannotBeMirrored: true,
            effect: 'replace it with {0}',
            handler: context => {
                context.player.moveCard(context.target, context.costs.returnToDeckStateWhenChosen.location);
                context.target.facedown = false;
            }
        });
    }
}

Rebuild.id = 'rebuild';

module.exports = Rebuild;
