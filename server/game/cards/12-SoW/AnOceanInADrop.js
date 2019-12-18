const DrawCard = require('../../drawcard.js');
const { Locations, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AnOceanInADrop extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place hand on bottom of deck and draw cards',
            condition: context => this.game.isDuringConflict() && context.source.parent && context.source.parent.isParticipating(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.sequential(this.getGameActions(this.owner)),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.sequential(this.getGameActions(this.owner.opponent))
                }
            },
            effect: 'place {1}\'s hand on the bottom of their deck and have {1} draw {2} cards',
            effectArgs: (context) => context.select === this.owner.name ? 
                [this.owner.name, context.player.hand.value().length] :
                [this.owner.opponent.name, context.player.opponent.hand.length]
        });
    }

    getGameActions(player) {
        return [
            AbilityDsl.actions.moveCard((context) => { 
                let target = context.player;
                if (player === this.owner.opponent) {
                    target = context.player.opponent;
                }
                return ({ shuffle: false,
                    bottom: true,
                    destination: Locations.ConflictDeck,
                    target: target.hand.shuffle() })
            }),
            AbilityDsl.actions.draw((context) => { 
                let target = context.player;
                if (player === this.owner.opponent) {
                    target = context.player.opponent;
                }
                return ({ target: target, amount: 3 })
            }),
        ];
    }
}

AnOceanInADrop.id = 'an-ocean-in-a-drop';

module.exports = AnOceanInADrop;
