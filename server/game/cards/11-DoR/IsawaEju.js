const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes } = require('../../Constants');

class IsawaEju extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in a province and refill it faceup',
            condition: context => this.game.rings.air.isConsideredClaimed(context.player),
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province
            },
            gameAction: AbilityDsl.actions.moveCard(context => ({
                destination: Locations.DynastyDiscardPile,
                target: context.target.controller.getDynastyCardsInProvince(context.target.location)
            })),
            effect: 'discard {1} and refill the province faceup',
            effectArgs: context => context.target.controller.getDynastyCardsInProvince(context.target.location).map(e => e.name).sort().join(', '),
            then: context => ({
                gameAction: AbilityDsl.actions.refillFaceup(() => ({
                    target: context.target.controller,
                    location: context.target.location
                }))
            }),
            limit: AbilityDsl.limit.perRound(3)
        });
    }
}

IsawaEju.id = 'isawa-eju';

module.exports = IsawaEju;
