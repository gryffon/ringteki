const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations, CardTypes, EventNames, AbilityTypes, PlayTypes } = require('../../Constants');

const EventRegistrar = require('../../eventregistrar.js');

class DragonTattoo extends DrawCard {
    extraBanzaiTarget = null;

    setupCardAbilities() {
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.WouldInterrupt]: 'onInitiateAbility'
        }]);

        this.reaction({
            when: {
                onCardPlayed: (event, context) => {
                    if(event.card.type === CardTypes.Event && event.card.controller === context.player && 
                        (event.card.location === Locations.ConflictDiscardPile || event.card.location === Locations.DynastyDiscardPile)) {
                        return this.checkTargets(event, context);
                    }
                }},
            title: 'Play card again',
            gameAction: AbilityDsl.actions.playCard(context => ({
                target: context.event.card,
                resetOnCancel: true,
                playType: PlayTypes.Other,
                destination: Locations.RemovedFromGame
                // postHandler: spellContext => {
                //     let card = spellContext.source;
                //     context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                //     context.player.moveCard(card, Locations.RemovedFromGame);
                // }
            })),
            effect: 'play {1}',
            effectArgs: context => context.event.card.name
            // gameAction: AbilityDsl.actions.multiple
            // AbilityDsl.actions.resolveAbility(context => ({
            //     target: context.event.card,
            //     ability: context.event.context.ability,
            //     ignoredRequirements: ['cost', 'condition', 'limit'],
            //     event: context.event.context.event
            // }))
        });
    }

    checkTargets(event, context) {
        let targets = [];
        if(event.context) {
            targets = _.flatten(_.values(event.context.targets));
            targets = targets.concat(_.flatten(_.values(event.context.selects)));
            if(!Array.isArray(targets)) {
                targets = [targets];
            }

            if(event.card.id === 'banzai') {
                if(this.extraBanzaiTarget) {
                    targets = targets.concat(this.extraBanzaiTarget);
                }
                this.extraBanzaiTarget = null;
            }

            targets = targets.filter(card => (
                card.type === CardTypes.Character &&
                card.controller === context.player &&
                card === context.source.parent &&
                card.location === Locations.PlayArea));
        }
        return targets.length > 0;
    }

    onInitiateAbility(event) {
        if(event.card.id === 'banzai') {
            if(event.context) {
                let targets = _.flatten(_.values(event.context.targets));
                targets = targets.concat(_.flatten(_.values(event.context.selects)));
                if(!Array.isArray(targets)) {
                    targets = [targets];
                }
                this.extraBanzaiTarget = targets[0];
            }
        }
    }
}

DragonTattoo.id = 'dragon-tattoo';

module.exports = DragonTattoo;
