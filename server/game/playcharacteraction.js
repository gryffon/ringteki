const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');

class PlayCharacterAction extends BaseAction {
    constructor(card) {
        super(card, [
            Costs.chooseFate(),
            Costs.payReduceableFateCost('play'),
            Costs.playLimited()
        ]);
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext()) {
        if(context.game.currentPhase === 'dynasty') {
            return 'phase';
        }
        if(!context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        if(!context.source.canPlay(context)) {
            return 'triggerAbility';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        let cardPlayedEvent = {
            name: 'onCardPlayed',
            params: { player: context.player, card: context.source, originalLocation: context.source.location }
        };
        let putIntoPlayHandler = () => {
            context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.chooseFate);
            let event = context.game.applyGameAction(context, { putIntoPlay: context.source }, [cardPlayedEvent])[0];
            event.fate = context.chooseFate;
        };
        if(context.source.allowGameAction('putIntoConflict', context)) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.chooseFate);
                        let event = context.game.applyGameAction(context, { putIntoConflict: context.source }, [cardPlayedEvent])[0];
                        event.fate = context.chooseFate;
                    },
                    putIntoPlayHandler
                ]
            });
        } else {
            putIntoPlayHandler();
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

