const DrawCard = require('../../drawcard.js');
import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class IronFoundationsStance extends DrawCard {
    setupCardAbilities() {
        this.kihoPlayedThisConflict = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);

        this.action({
            title: 'Prevent opponent\'s bow and send home effects',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects'
                        })
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    }),
                    AbilityDsl.actions.conditional({
                        condition: (context) => this.isKihoPlayed(context),
                        trueGameAction: AbilityDsl.actions.draw(context => ({ target: context.player })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ])
            },
            effect: 'prevent opponents\' actions from bowing or moving home {0}{1}',
            effectArgs: (context) => this.isKihoPlayed(context) ? ' and draw 1 card' : ''
        });
    }

    //in case there's a "You are considered to have played a kiho" effect printed at some point, you can put that in here
    isKihoPlayed(context) { // eslint-disable-line no-unused-vars
        return this.kihoPlayedThisConflict;
    }

    onConflictFinished() {
        this.kihoPlayedThisConflict = false;
    }

    onCardPlayed(event) {
        if(event && event.context.player === this.controller && event.context.source.hasTrait('kiho')) {
            this.kihoPlayedThisConflict = true;
        }
    }
}

IronFoundationsStance.id = 'iron-foundations-stance';

module.exports = IronFoundationsStance;
