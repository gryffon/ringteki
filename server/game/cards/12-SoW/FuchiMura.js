const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');

class FuchiMura extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place one fate on each unclaimed ring',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            gameAction: AbilityDsl.actions.placeFateOnRing(context =>
                ({ target: Object.values(context.game.rings).filter(ring => ring.isUnclaimed()) }))
        });
    }
}

FuchiMura.id = 'fuchi-mura';

module.exports = FuchiMura;
