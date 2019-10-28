const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');
const { EffectNames, Phases, PlayTypes, EventNames } = require('./Constants');

class DynastyCardAction extends BaseAction {
    constructor(card) {
        super(card, [
            Costs.chooseFate(PlayTypes.PlayFromProvince),
            Costs.payReduceableFateCost()
        ]);
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('facedown') && this.card.facedown) {
            return 'facedown';
        } else if(!ignoredRequirements.includes('player') && context.player !== this.card.controller) {
            return 'player';
        } else if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        } else if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(this.card, PlayTypes.PlayFromProvince)) {
            return 'location';
        } else if(!ignoredRequirements.includes('cannotTrigger') && !this.card.canPlay(context, PlayTypes.PlayFromProvince)) {
            return 'cannotTrigger';
        } else if(this.card.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.chooseFate);
        context.source.getRawEffects().filter(effect => effect.type === EffectNames.GainExtraFateWhenPlayed).map(effect =>
            context.game.addMessage('{0} enters play with {1} additional fate due to {2}', context.source, effect.value.value, effect.context.source)
        );
    }

    executeHandler(context) {
        const extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        let enterPlayEvent = GameActions.putIntoPlay({ fate: context.chooseFate + extraFate }).getEvent(context.source, context);
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromProvince
        });
        context.game.openEventWindow([enterPlayEvent, cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = DynastyCardAction;
