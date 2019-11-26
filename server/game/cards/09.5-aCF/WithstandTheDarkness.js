const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar.js');
const { Players, Locations, CardTypes, EventNames, AbilityTypes } = require('../../Constants');

class WithstandTheDarkness extends DrawCard {
    setupCardAbilities() {
        let currentTargets = [];
        // this.targets = {};
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.WouldInterrupt]: 'onInitiateAbilityEffects'
        }]);
        this.abilityRegistrar.register([{
            [EventNames.OnInitiateAbilityEffects + ':' + AbilityTypes.OtherEffects]: 'onInitiateAbilityEffects'
        }]);
        // this.abilityRegistrar.register([EventNames.OnCardPlayed, EventNames.OnCardLeavesPlay]);

        this.reaction({
            when: {
                onCardPlayed: (event, context) => {
                    currentTargets = event.cardTargets;
                    if (!Array.isArray(currentTargets))
                        currentTargets = [currentTargets];
                    return (event.card.controller === context.player.opponent &&
                    event.card.type === CardTypes.Event &&
                    currentTargets.some(card => (
                        card.type === CardTypes.Character &&
                        card.isFaction('crab') &&
                        card.controller === context.player &&
                        card.location === Locations.PlayArea))
                    );
                }},
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate.',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crab') && currentTargets.includes(card),
            },
            gameAction: AbilityDsl.actions.placeFate(),
            max: AbilityDsl.limit.perPhase(1),
        });
    }

    onInitiateAbilityEffects(event) {
        console.log(event.card.name + ' initiated');
        // let id = event.card.uuid;
        // if (!(id in this.targets))
        //     this.targets[id] = [];
        
        // this.targets[id] = this.targets[id].concat(event.cardTargets);
        // console.log(this.targets[id].map(e => e.name).join(', '));
    }

    // onCardPlayed(event) {
    //     let id = event.card.uuid;
    //     console.log('Card ' + id + ' played');
    // }

    // onCardLeavesPlay(event) {
    //     let id = event.card.uuid;
    //     console.log('Card ' + id + ' leaving play');
    //     if (id in this.targets) {
    //         delete(this.targets[id]);
    //     }
    // }
}

WithstandTheDarkness.id = 'withstand-the-darkness';

module.exports = WithstandTheDarkness;
