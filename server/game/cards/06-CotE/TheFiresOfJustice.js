const DrawCard = require('../../drawcard.js');
const { CardTypes, Players } = require('../../Constants');

class TheFiresOfJustice extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove fate or move fate to a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military'
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardCondition: card => card.isParticipating() && (card.controller.fate !== 0 || card.fate > 0),
                player: Players.Opponent,
                controller: Players.Opponent
            },
            handler: context => this.promptToChooseRemoveOrMove(context.target, context)
        });
    }

    canPlay(context, playType) {
        let anyOpponentsCharactersParticipatingWithFate = context.player.opponent.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.isParticipating() && card.fate > 0);
        let anyFateInOpponentsFatePool = context.player.opponent.fate > 0;

        if(!anyOpponentsCharactersParticipatingWithFate && !anyFateInOpponentsFatePool) {
            return false;
        }

        return super.canPlay(context, playType);
    }

    promptToChooseRemoveOrMove(card, context) {
        let choices = [];
        if(context.player.opponent.fate !== 0) {
            choices.push('Move fate to character');
        }
        if(context.target.fate !== 0) {
            choices.push('Remove all fate');
        }
        let handlers = choices.map(choice => {
            return () => this.applyChoice(choice, card, context);
        });
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select an effect:',
            context: context,
            choices: choices,
            handlers: handlers
        });
    }

    applyChoice(choice, card, context) {
        if(choice === 'Remove all fate') {
            let amount = card.fate;
            this.game.actions.removeFate({ amount: amount }).resolve(card, context);
            this.game.addMessage('{0} chooses to remove all fate ({1}) from {2}', context.player, amount, card);
        }
        if(choice === 'Move fate to character') {
            this.promptForFateAmount(card, context);
        }
    }

    promptForFateAmount(card, context) {
        let choices = Array.from(Array(context.player.opponent.fate), (x, i) => (i + 1).toString());
        let handlers = choices.map(choice => {
            return () => {
                this.game.actions.placeFate({ origin: context.player.opponent, amount: parseInt(choice) }).resolve(card, context);
                this.game.addMessage('{0} chooses to take {1} fate from {2} and place it on {3}', context.player, choice, context.player.opponent, card);
            };
        });
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select fate amount:',
            context: context,
            choices: choices,
            handlers: handlers
        });
    }
}

TheFiresOfJustice.id = 'the-fires-of-justice';

module.exports = TheFiresOfJustice;
