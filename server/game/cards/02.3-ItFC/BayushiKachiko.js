const DrawCard = require('../../drawcard.js');

class BayushiKachiko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: () => this.isParticipating() && this.game.currentConflict.conflictType === 'political',
            target: {
                cardType: 'character',
                gameAction: ability.actions.sendHome(),
                cardCondition: card => card.getPoliticalSkill() < this.getPoliticalSkill()
            },
            handler: context => {
                let sendHomeEvent = GameActions.eventTo.sendHome(context.target, context);
                let menuEvent = this.game.getEvent('menuEvent', { order: sendHomeEvent.order + 1 }, event => {
                    if(!GameActions.canBeAffectedBy.bow(context.target, context) || sendHomeEvent.cancelled) {
                        event.cancelThenEvents();
                        return;
                    }
                    this.game.promptWithHandlerMenu(context.player, {
                        source: context.source,
                        activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => context.game.addMessage('{0} chooses to bow {1} using {2}', context.player, context.target, context.source),
                            () => event.cancelThenEvents()
                        ]
                    });
                });
                menuEvent.addThenEvent(GameActions.eventTo.bow(context.target, context));
                this.game.openEventWindow(;
            }
        });
    }
}

BayushiKachiko.id = 'bayushi-kachiko';

module.exports = BayushiKachiko;
