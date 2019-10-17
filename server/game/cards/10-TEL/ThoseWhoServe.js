const DrawCard = require('../../drawcard');
const {CardTypes, Durations, Phases, PlayTypes} = require('../../Constants');

class ThoseWhoServe extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce the cost of your characters by 1 this phase',
            phase: Phases.Dynasty,
            effect: 'reduce the cost of their characters by 1 this phase',
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    // RRG does not allow characters to be played from hand in dynasty, but does not use the term "cannot" for this,
                    // so future card effects could nullify this restriction. In this case conflict characters would work with Those Who Serve.
                    playingTypes: [PlayTypes.PlayFromHand, PlayTypes.PlayFromProvince],
                    match: card => card.type === CardTypes.Character,
                    amount: 1
                })
            })
        });
    }
}

ThoseWhoServe.id = 'those-who-serve';

module.exports = ThoseWhoServe;
