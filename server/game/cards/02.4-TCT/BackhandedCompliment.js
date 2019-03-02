const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class BackhandedCompliment extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Select a player to lose an honor and draw a card',
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.loseHonor({ target: this.owner }),
                        AbilityDsl.actions.draw({ target: this.owner })
                    ]),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.loseHonor({ target: this.owner.opponent }),
                        AbilityDsl.actions.draw({ target: this.owner.opponent })
                    ])
                }
            },
            effect: 'to make {1} lose an honor and draw a card',
            effectArgs: context => context.select === this.owner.name ? this.owner : this.owner.opponent
        });
    }
}

BackhandedCompliment.id = 'backhanded-compliment';

module.exports = BackhandedCompliment;
