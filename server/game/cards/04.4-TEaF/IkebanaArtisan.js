const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IkebanaArtisan extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Lose fate instead of honor',
            when: {
                onModifyHonor: (event, context) => event.dueToUnopposed && event.player === context.player
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'lose 1 fate rather than 1 honor for not defending the conflict',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.loseFate(context => ({ target: context.player }))
            ])
        });
    }
}

IkebanaArtisan.id = 'ikebana-artisan';

module.exports = IkebanaArtisan;
