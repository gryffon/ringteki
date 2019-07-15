const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, TargetModes } = require('../../Constants');

class DishonorableAssault extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor Attackers',
            condition: context => context.source.isConflictProvince(),
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand,
                mode: TargetModes.Unlimited
            }),
            cannotTargetFirst: true,
            target: {
                targetingAction: context => ({
                    mode: TargetModes.Exactly,
                    targetType: CardTypes.Character,
                    cardCondition: card => card.isAttacking(),
                    numCards: context.cost.discardCard.length,    
                }),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}

DishonorableAssault.id = 'dishonorable-assault';

module.exports = DishonorableAssault;
