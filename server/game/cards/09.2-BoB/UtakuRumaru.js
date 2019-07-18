const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class UtakuRumaru extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isHonored && card.type === CardTypes.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.persistentEffect({
            match: (card) => card.isDishonored && card.type === CardTypes.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyGlory(-1)
        });

        this.reaction({
            title: 'Honor a participating character',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player
            },
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

UtakuRumaru.id = 'utaku-rumaru';
module.exports = UtakuRumaru;

