const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class CityOfTheOpenHand extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 honor or make opponent lose 1 honor',
            cost: ability.costs.bowSelf(),
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Gain 1 Honor': AbilityDsl.actions.gainHonor(),
                    'Make opponent lose 1 honor': AbilityDsl.actions.loseHonor()
                }
            }
        });
    }
}


CityOfTheOpenHand.id = 'city-of-the-open-hand';

module.exports = CityOfTheOpenHand;
