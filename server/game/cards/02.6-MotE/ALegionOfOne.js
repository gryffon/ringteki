const DrawCard = require('../../drawcard.js');

class ALegionOfOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a solitary character +3/+0',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isAttacking() && this.game.currentConflict.attackers.length === 1 ||
                                       card.isDefending() && this.game.currentConflict.defenders.length === 1
            },
            effect: 'give {0} +3/+0',
            handler: context => {
                let resolveAbility = () => {
                    context.source.untilEndOfConflict(ability => ({
                        match: context.target,
                        effect: ability.effects.modifyMilitarySkill(3)
                    }));
                };
                resolveAbility();
                if(context.target.fate > 0 && context.target.allowGameAction('removeFate')) {
                    let resolveAgain = () => {
                        this.game.addMessage('{0} removes a fate from {1}, resolving {2} again', context.player, context.target, context.source);
                        ability.actions.removeFate().resolve(context.target, context);
                        context.dontRaiseCardPlayed = true;
                        this.game.raiseInitiateAbilityEvent({ card: context.source, context: context }, () => {
                            resolveAbility();
                            if(context.target.fate > 0 && context.target.allowGameAction('removeFate')) {
                                this.game.promptWithHandlerMenu(context.player, {
                                    activePromptTitle: 'Discard a fate for no effect?',
                                    source: context.source,
                                    choices: ['Yes', 'No'],
                                    handlers: [() => {
                                        this.game.addMessage('{0} removes a fate from {1} for no effect', context.player, context.target);
                                        ability.actions.removeFate().resolve(context.target, context);
                                    }, () => true]
                                });
                            }
                        });
                    };
                    this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Discard a fate to resolve A Legion of One again?',
                        source: context.source,
                        choices: ['Yes', 'No'],
                        handlers: [resolveAgain, () => true]
                    });
                }
            }
        });
    }
}

ALegionOfOne.id = 'a-legion-of-one';

module.exports = ALegionOfOne;
