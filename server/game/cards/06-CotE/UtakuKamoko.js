const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class UtakuKamoko extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });
        this.reaction({
            title: 'Ready and honor',
            when: {
                onBreakProvince: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent
            },
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand,
                targets: true
            }),
            gameAction: [
                AbilityDsl.actions.ready(),
                AbilityDsl.actions.honor()
            ],
            effect: 'ready and honor {0}'
        });
    }
}

UtakuKamoko.id = 'utaku-kamoko';

module.exports = UtakuKamoko;
