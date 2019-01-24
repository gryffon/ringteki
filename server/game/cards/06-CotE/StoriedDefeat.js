const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar');
const CardAbility = require('../../CardAbility');
const { CardTypes, TargetModes } = require('../../Constants');

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
                gameAction: AbilityDsl.actions.bow()
            },
            then: context => ({
                target: {
                    mode: TargetModes.Select,
                    choices: {
                        'Spend 1 fate to dishonor this character': AbilityDsl.actions.loseFate({target: context.player }),
                        'Done': () => true
                    }
                },
                message: '{0} chooses {3}to spend a fate to dishonor {4}',
                messageArgs: thenContext => [thenContext.select === 'Done' ? 'not ' : '', context.target],
                then: {
                    gameAction: AbilityDsl.actions.resolveAbility({
                        subResolution: true,
                        ability: new CardAbility(this.game, context.source, {
                            title: 'Dishonor this character',
                            gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                        })
                    })
                }
            })
        });
    }

    onConflictFinished() {
        this.duelLosersThisConflict = [];
    }

    afterDuel(event) {
        if(event.duel.loser) {
            this.duelLosersThisConflict.push(event.duel.loser);
        }
    }
}

StoriedDefeat.id = 'storied-defeat';

module.exports = StoriedDefeat;
