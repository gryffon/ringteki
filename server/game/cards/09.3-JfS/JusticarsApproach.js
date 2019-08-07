const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { AbilityTypes, CardTypes, DuelTypes, Players, TargetModes } = require('../../Constants');

class JusticarsApproach extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Initiate a duel to dishonor/bow/discard',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                targets: {
                    challenger: {
                        cardType: CardTypes.Character,
                        mode: TargetModes.AutoSingle,
                        controller: Players.Self,
                        cardCondition: (card, context) => card === context.source
                    },
                    duelTarget: {
                        dependsOn: 'challenger',
                        cardType: CardTypes.Character,
                        controller: Players.Opponent,
                        cardCondition: card => card.isParticipating(),
                        gameAction: AbilityDsl.actions.duel(context => ({
                            type: DuelTypes.Military,
                            challenger: context.targets.challenger,
                            gameAction: duel => AbilityDsl.actions.multiple([
                                AbilityDsl.actions.dishonor({ target: duel.loser }),
                                AbilityDsl.actions.bow({ target: duel.loser && duel.loser.isDishonored ? duel.loser : null }),
                                AbilityDsl.actions.discardFromPlay({ target: duel.loser && duel.loser.isDishonored && duel.loser.bowed ? duel.loser : null })
                            ]),
                            message: '{0} {1}',
                            messageArgs: duel => [duel.loser.isDishonored && duel.loser.bowed ? 'discard' : duel.loser.isDishonored ? 'bow' : 'dishonor', duel.loser]
                        }))
                    }
                }
            })
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('courtier')) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

JusticarsApproach.id = 'justicar-s-approach';

module.exports = JusticarsApproach;
