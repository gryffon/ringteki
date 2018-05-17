const DrawCard = require('../../drawcard.js');

class Rebuild extends DrawCard {
    setupCardAbilities() {
        // TODO: rewrite this with reshuffle into deck as a cost
        this.action({
            title: 'Put a holding into play from your discard',
            targets: {
                cardToShuffle: {
                    activePromptTitle: 'Choose a card to shuffle into your deck',
                    cardCondition: (card, context) => ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location) && 
                                                      !card.isProvince && !context.player.getProvinceCardInProvince(card.location).isBroken
                },
                cardToRebuild: {
                    activePromptTitle: 'Choose a card to put into the province',
                    cardType: 'holding',
                    cardCondition: (card, context) => card.location === 'dynasty discard pile' && card.controller === context.player
                }
            },
            effect: 'shuffle {1} back into their deck and replace it with {2}',
            effectArgs: context => [context.targets.cardToShuffle.facedown ? 'a facedown card' : context.targets.cardToShuffle, context.targets.cardToRebuild],
            handler: context => {
                let location = context.targets.cardToShuffle.location;
                context.player.moveCard(context.targets.cardToShuffle, 'dynasty deck');
                context.player.shuffleDynastyDeck();
                context.player.moveCard(context.targets.cardToRebuild, location);
                context.targets.cardToRebuild.facedown = false;
            }
        });
    }
}

Rebuild.id = 'rebuild';

module.exports = Rebuild;
