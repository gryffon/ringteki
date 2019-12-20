const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, PlayTypes, Players } = require('../../Constants');
const PlayDisguisedCharacterAction = require('../../PlayDisguisedCharacterAction.js');
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

class ThirdWhiskerWarrensPlayDisguisedAction extends PlayDisguisedCharacterAction {
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
                return context && card === context.player.dynastyDeck.first();
            },
            effect: [
                AbilityDsl.effects.hideWhenFaceUp(),
                AbilityDsl.effects.gainPlayAction(ThirdWhiskerWarrensPlayAction),
                AbilityDsl.effects.gainPlayAction(ThirdWhiskerWarrensPlayDisguisedAction)
            ]
        });

        this.persistentEffect({
            condition: context => {
                if(context.player.isDefendingPlayer() && this.game.currentConflict.conflictProvince) {
                    let cards = context.player.getDynastyCardsInProvince(this.game.currentConflict.conflictProvince.location);
                    return cards.some(card => !card.facedown && card.type === CardTypes.Holding && card.hasTrait('kaiu-wall'));
                }
                return false;
            },
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopDynastyCard()
        });
    }
}

ThirdWhiskerWarrens.id = 'third-whisker-warrens';

module.exports = ThirdWhiskerWarrens;
