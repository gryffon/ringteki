const DrawCard = require('../../drawcard.js');
const PlayCharacterAction = require('../../playcharacteraction.js');
const _ = require('underscore');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, PlayTypes } = require('../../Constants');

class HiddenMoonDojoPlayAction extends PlayCharacterAction {
    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        return super.meetsRequirements(context, _.uniq(ignoredRequirements.concat('location')));
    }
}

class HiddenMoonDojo extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => card.isDynasty && !card.facedown && context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: AbilityDsl.effects.gainPlayAction(HiddenMoonDojoPlayAction)
        });

        this.action({
            title: 'Turn an adjacent card face up',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.selectCard({
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => context.player.areLocationsAdjacent(context.source.location, card.location),
                gameAction: AbilityDsl.actions.flipDynasty(),
                message: '{0} chooses to turn {1} in {2} faceup',
                messageArgs: (card, player) => [player, card, card.location]
            }),
            effect: 'turn a card in an adjacent province faceup'
        });
    }
}

HiddenMoonDojo.id = 'hidden-moon-dojo';

module.exports = HiddenMoonDojo;
