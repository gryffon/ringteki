const ProvinceCard = require('../../provincecard.js');
const { Locations, Players } = require('../../Constants');

class AppealingToTheFortunes extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            condition: context => context.player.role && context.player.role.hasTrait('void'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Choose a character',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                controller: Players.Self,
                location: [Locations.Provinces, Locations.Hand],
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

AppealingToTheFortunes.id = 'appealing-to-the-fortunes';

module.exports = AppealingToTheFortunes;
