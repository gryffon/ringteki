const DrawCard = require('../../drawcard.js');
const { CardTypes, TargetModes } = require('../../Constants');

class KuniYori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('earth'),
            match: card => card.getType() === CardTypes.Character,
            effect: ability.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Select a player to discard a card at random',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(1),
            target: {
                mode: TargetModes.Select,
                activePromptTitle:'Select a player to discard a random card from his/her hand',
                targets: true,
                choices: {
                    [this.owner.name]: ability.actions.discardAtRandom({ target: this.owner }),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: ability.actions.discardAtRandom({ target: this.owner.opponent })
                }
            }
        });
    }
}

KuniYori.id = 'kuni-yori';

module.exports = KuniYori;
