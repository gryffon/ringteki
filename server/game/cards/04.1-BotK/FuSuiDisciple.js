const DrawCard = require('../../drawcard.js');
const { Players, TargetModes, CardTypes } = require('../../Constants');

class FuSuiDisciple extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character controlled by a player with the air ring',
            targets: {
                player: {
                    mode: TargetModes.Select,
                    activePromptTitle: 'Choose a player',
                    targets: true,
                    choices: {
                        [this.owner.name]: context => context.game.rings.air.isConsideredClaimed(this.owner),
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: context => context.game.rings.air.isConsideredClaimed(this.owner.opponent)
                    }
                },
                character: {
                    dependsOn: 'player',
                    player: context => context.selects.player.choice === context.player.name ? Players.Self : Players.Opponent,
                    activePromptTitle: 'Choose a character to be honored or dishonored',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => {
                        let player = context.selects.player.choice === context.player.name ? context.player : context.player.opponent;
                        return !card.isHonored && !card.isDishonored && card.controller === player;
                    }
                },
                effect: {
                    dependsOn: 'character',
                    mode: TargetModes.Select,
                    choices: {
                        'Honor this character': ability.actions.honor(context => ({ target: context.targets.character })),
                        'Dishonor this character': ability.actions.dishonor(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}

FuSuiDisciple.id = 'fu-sui-disciple';

module.exports = FuSuiDisciple;
