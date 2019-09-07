import { Durations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar');
const { CardTypes } = require('../../Constants');

class RisingStarsKata extends DrawCard {
    setupCardAbilities() {
        this.duelWinnersThisConflict = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);

        this.action({
            title: 'Give a participating unique character +3 military skill',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfConflict,
                    effect: this.duelWinnersThisConflict.includes(context.target) ?
                        AbilityDsl.effects.modifyMilitarySkill(5) :
                        AbilityDsl.effects.modifyMilitarySkill(3),
                })),
            },
            effect: 'give {0} +{1} military skill until the end of the conflict',
            effectArgs: context => [this.duelWinnersThisConflict.includes(context.target) ? 5 : 3],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    onConflictFinished() {
        this.duelWinnersThisConflict = [];
    }

    afterDuel(event) {
        if(event.duel.winner) {
            this.duelWinnersThisConflict.push(event.duel.winner);
        }
    }
}

RisingStarsKata.id = 'rising-stars-kata';

module.exports = RisingStarsKata;

