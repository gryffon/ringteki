const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar');
const CardAbility = require('../../CardAbility');
const { CardTypes, EventNames } = require('../../Constants');

class StoriedDefeat extends DrawCard {
    setupCardAbilities() {
        this.duelLosersThisConflict = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);

        this.action({
            title: 'Bow a character who lost a duel',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => this.duelLosersThisConflict.includes(card),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.menuPrompt(context => ({
                        activePromptTitle: 'Spend 1 fate to dishonor ' + context.target.name + '?',
                        choices: ['Yes'].concat(context.events.some(event => event.name === EventNames.OnCardBowed) ? ['No'] : []),
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage) {
                                context.game.addMessage('{0} chooses {1}to spend a fate to dishonor {2}', context.player, choice === 'No' ? 'not ' : '', context.target);
                            }
                            return { amount: choice === 'Yes' ? 1 : 0 };
                        },
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseFate({ target: context.player }),
                            AbilityDsl.actions.resolveAbility({
                                target: context.source,
                                subResolution: true,
                                ability: new CardAbility(this.game, context.source, {
                                    title: 'Dishonor this character',
                                    gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                                })
                            })
                        ])
                    }))
                ])
            }
        });
    }

    onConflictFinished() {
        this.duelLosersThisConflict = [];
    }

    afterDuel(event) {
        if(Array.isArray(event.duel.loser)) {
            event.duel.loser.forEach(duelLoser => {
                if(this.duelLosersThisConflict.indexOf(duelLoser) === -1) {
                    this.duelLosersThisConflict.push(duelLoser);
                }
            });
        } else if(event.duel.loser) {
            this.duelLosersThisConflict.push(event.duel.loser);
        }
    }
}

StoriedDefeat.id = 'storied-defeat';

module.exports = StoriedDefeat;
