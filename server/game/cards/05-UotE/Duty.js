const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Stages } = require('../../Constants.js');

class Duty extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) =>
                    event.player === context.player && -event.amount >= context.player.honor && event.context.stage === Stages.Effect,
                onTransferHonor: (event, context) =>
                    event.player === context.player && event.amount >= context.player.honor && event.context.stage === Stages.Effect
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
            ])
        });
    }
}

Duty.id = 'duty';

module.exports = Duty;
