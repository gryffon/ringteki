const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class KensonNoGakka extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: "Honor all defenders",
            when: {
                afterConflict: (event, context) => context.source.isConflictProvince()
                    && event.conflict.loser === context.player
            },
            gameAction: AbilityDsl.actions.honor(context => ({
                target: context.game.currentConflict.defenders
            }))
        });
    }
}

KensonNoGakka.id = 'kenson-no-gakka';

module.exports = KensonNoGakka;
