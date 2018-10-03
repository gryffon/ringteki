const DrawCard = require('../../drawcard.js');

class Rebuild extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a holding into play from your discard',
            cost: ability.costs.shuffleIntoDeck((card, context) =>
                ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location) &&
                !context.player.getProvinceCardInProvince(card.location).isBroken
            ),
            target: {
                activePromptTitle: 'Choose a card to put into the province',
                cardType: 'holding',
                location: 'dynasty discard pile',
                controller: 'self',
                gameAction: ability.actions.moveCard(context => ({
                    faceup: true,
                    location: context.costs.returnToDeckStateWhenChosen && context.costs.returnToDeckStateWhenChosen.location
                }))
            },
            cannotTargetFirst: true,
            cannotBeMirrored: true,
            effect: 'replace it with {0}',
        });
    }
}

Rebuild.id = 'rebuild';

module.exports = Rebuild;
