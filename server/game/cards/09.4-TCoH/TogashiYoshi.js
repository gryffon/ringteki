import { TargetModes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TogashiYoshi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate of an unclaimed ring',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                    context.source.isParticipating()
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition:  ring => ring.fate >= 1 &&
                    ring.contested === false &&
                    ring.claimed === false
            },
            effect: 'gain 1 fate from the {1}',
            effectArgs: context => context.ring,
            gameAction: AbilityDsl.actions.takeFateFromRing(context => ({
                target: context.ring
            }))
        });
    }
}

TogashiYoshi.id = 'togashi-yoshi';

module.exports = TogashiYoshi;

