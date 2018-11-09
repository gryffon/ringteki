const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class HirumaOutpost extends DrawCard {
    setupCardAbilities(ability) {
        this.grantedAbilityLimits = {};
        this.persistentEffect({
            condition: context => !context.player.getProvinceCardInProvince(context.source.location).isBroken,
            effect: ability.effects.gainAbility('reaction', {
                title: 'Make opponent lose an honor',
                when: {
                    onConflictDeclared: (event, context) => {
                        if(event.conflict.attackingPlayer === context.player) {
                            return false;
                        }
                        let card = context.player.getDynastyCardInProvince(event.conflict.conflictProvince.location);
                        return !card || card.facedown || card.type !== CardTypes.Holding;
                    }
                },
                gameAction: ability.actions.loseHonor()
            })
        });
    }

    leavesPlay() {
        this.grantedAbilityLimits = {};
        super.leavesPlay();
    }
}

HirumaOutpost.id = 'hiruma-outpost';

module.exports = HirumaOutpost;
