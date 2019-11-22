const DrawCard = require('../../drawcard');
const {CardTypes, Durations, Phases} = require('../../Constants');

class ThoseWhoServe extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce the cost of your characters by 1 this phase',
            phase: Phases.Dynasty,
            effect: 'reduce the cost of their characters by 1 this phase',
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    match: card => card.type === CardTypes.Character,
                    amount: 1
                })
            })
        });
    }
}

ThoseWhoServe.id = 'those-who-serve';

module.exports = ThoseWhoServe;
