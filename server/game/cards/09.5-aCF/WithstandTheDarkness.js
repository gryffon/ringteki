const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations, CardTypes } = require('../../Constants');

class WithstandTheDarkness extends DrawCard {
    setupCardAbilities() {
        let currentTargets = [];

        this.reaction({
            when: {
                onCardPlayed: (event, context) => {
                    if(event.card.type === CardTypes.Event && event.card.controller === context.player.opponent) {
                        currentTargets = this.getLegalWithstandTargets(event, context);
                        return currentTargets.length > 0;
                    }
                }},
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => currentTargets.includes(card),
                gameAction: AbilityDsl.actions.placeFate()
            },
            max: AbilityDsl.limit.perPhase(1)
        });
    }

    getLegalWithstandTargets(event, context) {
        if(event.context) {
            let targets = _.flatten(_.values(event.context.targets));
            targets = targets.concat(_.flatten(_.values(event.context.selects)));
            if(!Array.isArray(targets)) {
                targets = [targets];
            }

            targets = targets.filter(card => (
                card.type === CardTypes.Character &&
                card.isFaction('crab') &&
                card.controller === context.player &&
                card.location === Locations.PlayArea));
            return targets;
        }
        return [];
    }
}

WithstandTheDarkness.id = 'withstand-the-darkness';

module.exports = WithstandTheDarkness;
