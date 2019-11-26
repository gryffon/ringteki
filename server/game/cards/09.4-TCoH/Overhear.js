const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, TargetModes } = require('../../Constants');
const CardAbility = require('../../CardAbility');

class Overhear extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place random card on top of deck',
            effect: 'reveal a random card from {1}\'s hand and place it on top of {1}\'s deck',
            effectArgs: context=> [context.player.opponent],
            gameAction:AbilityDsl.actions.sequential([AbilityDsl.actions.moveCard(context => ({
                target: context.player.opponent && context.player.opponent.hand.shuffle().slice(0, 1),
                destination: Locations.ConflictDeck
            })),
            AbilityDsl.actions.lookAt(context => ({
                target: context.player.opponent.conflictDeck.first(1),
                message: '{0} sees {1}',
                messageArgs : cards => ([context.player, cards[0]])
            }))
            ]),
            condition: context => context.game.isDuringConflict('political'),
            then: context => {
                if(context.game.currentConflict.getCharacters(context.player).filter(card => card.hasTrait('courtier')).length < 1) {
                    return;
                }
                if(context.subResolution) {
                    return {
                        target: {
                            mode: TargetModes.Select,
                            choices: {
                                'Give 1 honor for no effect': AbilityDsl.actions.takeHonor({ target: context.player }),
                                'Done': () => true
                            }
                        },
                        message: '{0} chooses {3}to give an honor to {4} for no effect',
                        messageArgs: context => [context.select === 'Done' ? 'not ' : '', context.player.opponent]
                    };
                }
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: {
                            'Give 1 honor to resolve this ability again': AbilityDsl.actions.takeHonor({ target: context.player }),
                            'Done': () => true
                        }
                    },
                    message: '{0} chooses {3}to give an honor to {4} to resolve {1} again',
                    messageArgs: context => [context.select === 'Done' ? 'not ' : '', context.player.opponent],
                    then: { gameAction: AbilityDsl.actions.resolveAbility({ ability: context.ability instanceof CardAbility ? context.ability : null, subResolution: true }) }
                };
            }
        });
    }
}

Overhear.id = 'overhear';

module.exports = Overhear;

