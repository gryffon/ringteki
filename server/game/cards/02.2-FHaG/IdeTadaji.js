const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class IdeTadaji extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move characters into conflict',
            condition: context => context.source.isParticipating(),
            targets: {
                myChar: {
                    cardType: 'character',
                    controller: Players.Self,
                    cardCondition: card => !card.bowed && card.costLessThan(3),
                    gameAction: ability.actions.moveToConflict()
                },
                oppChar: {
                    cardType: 'character',
                    controller: Players.Opponent,
                    cardCondition: card => !card.bowed && card.costLessThan(3),
                    gameAction: ability.actions.moveToConflict()
                }
            }
        });
    }
}

IdeTadaji.id = 'ide-tadaji';

module.exports = IdeTadaji;
