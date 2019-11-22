import { AbilityTypes, CardTypes, Locations, Players, Durations } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class VoiceOfTheAncestors extends DrawCard {
    setupCardAbilities() {
        const DummySpiritAttachment = new DrawCard(this.owner, {
            cost: 0,
            glory: '0',
            side: 'dynasty',
            text: '',
            type: 'attachment',
            name: 'Spirit Attachment',
            id: 'dummy-spirit-attachment',
            traits: ['spirit']
        });

        this.action({
            title: 'Attach a character as a Spirit',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.game.actions.attach({ attachment: DummySpiritAttachment }).canAffect(card, context)
            },
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                cardCondition: card => card.isFaction('lion'),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playerLastingEffect({
                        effect: AbilityDsl.effects.reduceNextPlayedCardCost(1)
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        canChangeZoneOnce: true,
                        duration: Durations.Custom,
                        effect: [
                            AbilityDsl.effects.blank(true),
                            AbilityDsl.effects.changeType('attachment'),
                            AbilityDsl.effects.addTrait('spirit'),
                            AbilityDsl.effects.attachmentRestrictTraitAmount({ spirit: 1 }),
                            AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                                match: (card, context) => card === context.source.parent,
                                effect: [
                                    AbilityDsl.effects.modifyMilitarySkill((card, context) => context.source.printedMilitarySkill || 0),
                                    AbilityDsl.effects.modifyPoliticalSkill((card, context) => context.source.printedPoliticalSkill || 0)
                                ]
                            })
                        ]
                    }),
                    AbilityDsl.actions.playCard(context => ({
                        playCardTarget: attachContext => {
                            attachContext.target = context.target;
                            attachContext.targets.target = context.targets.target;
                        }
                    }))
                ])
            })
        });
    }
}

VoiceOfTheAncestors.id = 'voice-of-the-ancestors';

module.exports = VoiceOfTheAncestors;
