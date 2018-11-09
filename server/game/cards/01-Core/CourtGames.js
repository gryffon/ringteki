const DrawCard = require('../../drawcard.js');
const { Players, TargetModes, CardTypes } = require('../../Constants');

class CourtGames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            max: ability.limit.perConflict(1),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Honor a friendly character': ability.actions.honor(context => ({
                        promptForSelect: {
                            cardType: CardTypes.Character,
                            controller: Players.Self,
                            targets: true,
                            cardCondition: card => card.isParticipating(),
                            message: '{0} chooses to honor {1}',
                            messageArgs: card => [context.player, card]
                        }
                    })),
                    'Dishonor an opposing character': ability.actions.dishonor(context => ({
                        promptForSelect: {
                            player: context.player.opponent,
                            cardType: CardTypes.Character,
                            controller: Players.Opponent,
                            targets: true,
                            cardCondition: card => card.isParticipating(),
                            message: '{0} chooses to dishonor {1}',
                            messageArgs: card => [context.player.opponent, card]
                        }
                    }))
                }
            },
            effect: '{1}',
            effectArgs: context => context.select.toLowerCase()
        });
    }
}

CourtGames.id = 'court-games';

module.exports = CourtGames;

