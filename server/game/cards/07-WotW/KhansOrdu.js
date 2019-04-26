const ProvinceCard = require('../../provincecard.js');
const { ConflictTypes, Durations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KhansOrdu extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Make all conflicts military',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.switchConflictType(context => ({
                    targetConflictType: ConflictTypes.Military,
                    target: context.game.currentConflict.ring
                })),
                AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Any,
                    effect: AbilityDsl.effects.setConflictDeclarationType(ConflictTypes.Military),
                    duration: Durations.UntilEndOfPhase
                })
            ]),
            effect: 'switch the conflict type to {1} and make all future conflicts {1} for this round',
            effectArgs: ['military']
        });
    }
}

KhansOrdu.id = 'khan-s-ordu';

module.exports = KhansOrdu;
