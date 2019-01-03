const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SincereChallenger extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: context => ({
                type: 'political',
                resolutionHandler: (winner) => this.resolutionHandler(context, winner)
            })
        });
    }

    resolutionHandler(context, winner) {
        this.game.addMessage('{0} wins the duel and is immune to events until the end of the conflict', winner);
        this.game.actions.cardLastingEffect({ effect: AbilityDsl.effects.immunity({ restricts: 'events' }) }).resolve(winner, context);
    }
}

SincereChallenger.id = 'sincere-challenger';

module.exports = SincereChallenger;
