const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const RingEffects = require('../../RingEffects.js');

class TogashiMitsu2 extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action({
            title: 'Resolve a ring effect',
            condition: context => context.source.isParticipating() && this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 5,
            gameAction: AbilityDsl.actions.selectRing(context => ({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                targets: true,
                message: '{0} chooses to resolve {1}\'s effect',
                ringCondition: ring => RingEffects.contextFor(context.player, ring.element, false).ability.hasLegalTargets(context),
                messageArgs: ring => [context.player, ring],
                gameAction: AbilityDsl.actions.resolveRingEffect({ player: context.player })
            })),
            effect: 'resolve a ring effect'
        });
    }
}

TogashiMitsu2.id = 'togashi-mitsu-2';

module.exports = TogashiMitsu2;
