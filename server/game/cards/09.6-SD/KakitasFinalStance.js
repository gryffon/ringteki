const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KakitasFinalStance extends DrawCard {
    setupCardAbilities() {
        this.duelParticipantsThisConflict = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);
        this.action({
            title: 'Character cannot be bowed and doesn\'t bow during resolution',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: [
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        condition: () => this.duelParticipantsThisConflict.includes(context.target),
                        effect: AbilityDsl.effects.doesNotBow()
                    })),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    })
                ]
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict if it is involved in a duel'
        });
    }

    onConflictFinished() {
        this.duelParticipantsThisConflict = [];
    }

    afterDuel(event) {
        if(event.duel.challenger) {
            let duelist = event.duel.challenger;
            if(!Array.isArray(duelist)) {
                duelist = [duelist];
            }
            this.duelParticipantsThisConflict = this.duelParticipantsThisConflict.concat(duelist);
        }
        if(event.duel.target) {
            let duelist = event.duel.target;
            if(!Array.isArray(duelist)) {
                duelist = [duelist];
            }
            this.duelParticipantsThisConflict = this.duelParticipantsThisConflict.concat(duelist);
        }
    }
}

KakitasFinalStance.id = 'kakita-s-final-stance';

module.exports = KakitasFinalStance;
