const DrawCard = require('../../drawcard.js');
const { TargetModes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class SlovenlyScavenger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Shuffle a discard pile into a deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating()
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which discard pile to shuffle:',
                choices: {
                    'My Dynasty': context => context.player.dynastyDiscardPile.size() > 0,
                    'My Conflict': context => context.player.conflictDiscardPile.size() > 0,
                    'Opponent\'s Dynasty': context => context.player.opponent && context.player.opponent.dynastyDiscardPile.size() > 0,
                    'Opponent\'s Conflict': context => context.player.opponent && context.player.opponent.conflictDiscardPile.size() > 0
                }
            },
            effect: 'shuffle {1} into their deck',
            effectArgs: context => this.getEffectArg(context, context.select),
            handler: context => {
                if(context.select === 'My Dynasty') {
                    context.player.dynastyDiscardPile.forEach(card => {
                        context.player.moveCard(card, Locations.DynastyDeck);
                    });
                    context.player.shuffleDynastyDeck();
                }
                if(context.select === 'My Conflict') {
                    context.player.conflictDiscardPile.forEach(card => {
                        context.player.moveCard(card, Locations.ConflictDeck);
                    });
                    context.player.shuffleConflictDeck();
                }
                if(context.select === 'Opponent\'s Dynasty') {
                    context.player.opponent.dynastyDiscardPile.forEach(card => {
                        context.player.opponent.moveCard(card, Locations.DynastyDeck);
                    });
                    context.player.opponent.shuffleDynastyDeck();
                }
                if(context.select === 'Opponent\'s Conflict') {
                    context.player.opponent.conflictDiscardPile.forEach(card => {
                        context.player.opponent.moveCard(card, Locations.ConflictDeck);
                    });
                    context.player.opponent.shuffleConflictDeck();
                }
            }
        });
    }

    getEffectArg(context, selection) {
        if(selection === 'My Dynasty') {
            return context.player.name + '\'s dynasty discard pile';
        }
        if(selection === 'My Conflict') {
            return context.player.name + '\'s conflict discard pile';
        }
        if(selection === 'Opponent\'s Dynasty') {
            return context.player.opponent.name + '\'s dynasty discard pile';
        }
        if(selection === 'Opponent\'s Conflict') {
            return context.player.opponent.name + '\'s conflict discard pile';
        }
        return 'Unknown target';
    }
}

SlovenlyScavenger.id = 'slovenly-scavenger';

module.exports = SlovenlyScavenger;
