const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes, Durations } = require('../../Constants');

class PlayTattooedWandererAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card, true);
        this.title = 'Play Tattooed Wanderer as an attachment';
    }

    executeHandler(context) {
        AbilityDsl.actions.cardLastingEffect({
            duration: Durations.Custom,
            canChangeZoneOnce: true,
            effect: AbilityDsl.effects.changeType(CardTypes.Attachment)
        }).resolve(this.card, context);
        super.executeHandler(context);
    }
}

class TattooedWanderer extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTattooedWandererAsAttachment(this));
        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
}

TattooedWanderer.id = 'tattooed-wanderer';

module.exports = TattooedWanderer;
