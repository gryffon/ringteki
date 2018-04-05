const AbilityContext = require('../../AbilityContext.js');
const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class GuidanceOfTheAncestors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play this from the discard pile',
            condition: () => this.controller.fate >= this.controller.getReducedCost('play', this),
            location: 'conflict discard pile',
            handler: () => {
                let context = new AbilityContext({
                    game: this.game,
                    player: this.controller,
                    source: this,
                    ability: new PlayAttachmentAction()
                });
                this.game.resolveAbility(context);
            }
        });
    }
}

GuidanceOfTheAncestors.id = 'guidance-of-the-ancestors';

module.exports = GuidanceOfTheAncestors;
