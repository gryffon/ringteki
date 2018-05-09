const DrawCard = require('../../drawcard.js');

class MirumotoRaitsugu extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Duel an opposing character',
            condition: context => context.source.isParticipating(),
            target: {
                cardCondition: (card, context) => card.controller !== context.player && card.isParticipating(),
                gameAction: ability.actions.duel('military', this.resolutionHandler).options(context => ({ challenger: context.source }))
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser && loser.fate > 0) {
            this.game.addMessage('{0} wins the duel, and {1} loses a fate', winner, loser);
            this.game.applyGameAction(context, { removeFate: loser });
        } else if(loser) {
            this.game.addMessage('{0} wins the duel, and {1} is discarded', winner, loser);
            this.game.applyGameAction(context, { discardFromPlay: loser });
        }
    }
}

MirumotoRaitsugu.id = 'mirumoto-raitsugu';

module.exports = MirumotoRaitsugu;
