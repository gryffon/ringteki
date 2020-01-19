const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const nitenCaptureParentCost = function() {
    return {
        action: { name: 'nitenCaptureParentCost', getCostMessage: () => '' },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.costs.nitenCaptureParentCost = context.source.parent;
        },
        pay: function() {
        }
    };

};

class Niten extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            faction: 'dragon'
        });

        this.action({
            title: 'Put an attachment into play',
            condition: context => context.source.parent && context.source.parent.isParticipating(),
            cost: [
                nitenCaptureParentCost(),
                AbilityDsl.costs.returnSelfToHand()
            ],
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                location: Locations.Hand,
                cardCondition: (card, context) => card.canAttach(context.source.parent, context) || card.canAttach(context.costs.nitenCaptureParentCost, context)
            },
            gameAction: AbilityDsl.actions.attach(context => ({
                target: context.costs.nitenCaptureParentCost,
                attachment: context.target
            })),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

Niten.id = 'niten';

module.exports = Niten;
