const DrawCard = require('../../drawcard.js');
const { Locations, Decks, Phases, Durations, CardTypes, PlayTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const PlayCharacterAction = require('../../playcharacteraction');

class ThirdWhiskerWarrensPlayAction extends PlayCharacterAction {
    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class ThirdWhiskerWarrens extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => {
                if(context.player.isDefendingPlayer() && this.game.currentConflict.conflictProvince) {
                    let cards = context.player.getDynastyCardsInProvince(this.game.currentConflict.conflictProvince.location);
                    return cards.some(card => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
                return false;
            },
            targetLocation: Locations.DynastyDeck,
            match: (card, context) => {
                return card.getType() === CardTypes.Character && card === context.player.dynastyDeck.first()
            },
            effect: [
                AbilityDsl.effects.hideWhenFaceUp(),
                AbilityDsl.effects.gainPlayAction(ThirdWhiskerWarrensPlayAction)
            ]
        });

        this.action({
            title: 'Make top card of conflict deck playable',
            effect: 'reveal the top card of their conflict deck',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => {
                return {
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.showTopDynastyCard(),
                };
            })
        });
    }
}

ThirdWhiskerWarrens.id = 'third-whisker-warrens';

module.exports = ThirdWhiskerWarrens;
