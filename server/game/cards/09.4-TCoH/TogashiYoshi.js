import { TargetModes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TogashiYoshi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate from an unclaimed ring',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                    context.source.isParticipating()
            },
            effect: 'gain 1 fate from the {1}',
            effectArgs: context => context.ring,
            gameAction: AbilityDsl.actions.selectRing(context => ({
                ringCondition:  ring => ring.fate >= 1 &&
                    ring.contested === false &&
                    ring.claimed === false,
                target: context.ring,
                gameAction: AbilityDsl.actions.takeFateFromRing()
            }))
        });
    }
}

TogashiYoshi.id = 'togashi-yoshi';

module.exports = TogashiYoshi;

