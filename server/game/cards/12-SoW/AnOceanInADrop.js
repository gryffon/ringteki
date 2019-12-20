const DrawCard = require('../../drawcard.js');
const { Locations, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AnOceanInADrop extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place hand on bottom of deck and draw cards',
            condition: context => context.source.parent.isParticipating(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.sequential(this.getGameActions(this.owner)),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.sequential(this.getGameActions(this.owner.opponent))
                }
            },
            effect: 'place {1}\'s hand on the bottom of their deck and have them draw {2} cards',
            effectArgs: (context) => context.select === this.owner.name ?
                [this.owner.name, context.player.hand.value().length] :
                [this.owner.opponent.name, context.player.opponent.hand.value().length]
        });
    }

    getGameActions(player) {
        return [
            AbilityDsl.actions.moveCard(() => ({
                shuffle: false,
                bottom: true,
                destination: Locations.ConflictDeck,
                target: player.hand.shuffle()
            })),
            AbilityDsl.actions.draw((context) => ({ target: player, amount: context.events.length }))
        ];
    }
}

AnOceanInADrop.id = 'an-ocean-in-a-drop';

module.exports = AnOceanInADrop;
