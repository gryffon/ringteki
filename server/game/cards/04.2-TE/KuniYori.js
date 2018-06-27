const DrawCard = require('../../drawcard.js');

class KuniYori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (this.game.currentConflict && this.game.currentConflict.hasElement('earth')),
            effect: ability.effects.modifyBothSkills(1)
        });

        this.action({
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(1),
            title: 'Select a player to discard a random card from his/her hand',
            target: {
                mode: 'select',
                choices: {
                    'Me': ability.actions.discardAtRandom(context => ({ target: context.player })),
                    'My Opponent': ability.actions.discardAtRandom()
                }
            }
        });
    }
}

KuniYori.id = 'kuni-yori';

module.exports = KuniYori;
