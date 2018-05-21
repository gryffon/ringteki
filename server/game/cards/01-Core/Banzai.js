const DrawCard = require('../../drawcard.js');

class Banzai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.currentConflict,
            max: ability.limit.perConflict(1),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating()
            },
            effect: 'grant 2 military skill to {0}',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.modifyMilitarySkill(2)
            }),
            handler: context => this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select one',
                source: context.source,
                choices: ['Lose 1 honor to resolve this ability again', 'Done'],
                handlers: [
                    () => {
                        ability.actions.loseHonor().resolve(context.player, context);
                        this.game.promptForSelect(context.player, {
                            context: context,
                            cardType: 'character',
                            cardCondition: card => card.isParticipating(),
                            onSelect: (player, card) => {
                                context.targets.target = card;
                                context.target = card;
                                context.dontRaiseCardPlayed = true;
                                this.game.raiseInitiateAbilityEvent({ card: context.source, context: context }, () => {
                                    context.source.untilEndOfConflict(ability => ({
                                        match: card,
                                        effect: ability.effects.modifyMilitarySkill(2)
                                    }));
                                    this.game.promptWithHandlerMenu(player, {
                                        source: context.source,
                                        choices: ['Lose 1 honor for no effect', 'Done'],
                                        handlers: [() => {
                                            this.game.addMessage('{0} loses 1 honor for no effect', player);
                                            ability.actions.loseHonor().resolve(context.player, context);
                                        }, () => true]
                                    });
                                });
                                return true;
                            }
                        });
                    },
                    () => true
                ]
            })
        });
    }
}

Banzai.id = 'banzai';

module.exports = Banzai;
