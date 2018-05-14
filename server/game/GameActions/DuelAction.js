const CardGameAction = require('./CardGameAction');
const Duel = require('../Duel.js');
const DuelFlow = require('../gamesteps/DuelFlow.js');

class DuelAction extends CardGameAction {
    constructor(type, resolutionHandler, challenger, costHandler) {
        super('duel');
        this.type = type;
        this.challenger = challenger;
        this.resolutionHandler = resolutionHandler;
        this.costHandler = costHandler;
        this.targetType = ['character'];
        this.effect = 'initiate a {1} duel between {2} and {0}';
        this.effectArgs = () => {
            return [this.type, this.challenger];
        };
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        return card.location === 'play area' && !card.hasDash(this.type);
    }

    resolveDuel(winner, loser) {
        this.resolutionHandler(this.context, winner, loser);
    }

    honorCosts(prompt) {
        this.costHandler(this.context, prompt);
    }

    getEvent(card, context) {
        this.context = context;
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            if(this.challenger.location !== 'play area' || card.location !== 'play area') {
                context.game.addMessage('The duel cannot proceed as one participant is no longer in play');
                return;
            }
            context.game.currentDuel = new Duel(this, this.challenger, card, this.type);
            context.game.queueStep(new DuelFlow(this, context.game.currentDuel, this.honorCosts, this.resolveDuel));                
        });
    }
}

module.exports = DuelAction;
