const ProvinceCard = require('../../provincecard.js');
const { Locations } = require('../../Constants');

class DemonstratingExcellence extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            condition: context => context.player.role && context.player.role.hasTrait('air'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Gain 1 fate and draw 1 card',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            effect: 'gain 1 fate and draw a card',
            gameAction: [
                ability.actions.gainFate(),
                ability.actions.draw()
            ]
        });
    }
}

DemonstratingExcellence.id = 'demonstrating-excellence';

module.exports = DemonstratingExcellence;
