const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

const { CardTypes, Durations } = require('../../Constants');

class TogashiHoshi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Turn attachment into character',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent.controller === context.player,
                subActionProperties: card => ({
                    target: card,
                    effect: [AbilityDsl.effects.changeType(CardTypes.Character)].concat(
                        card.printedType === CardTypes.Attachment ? [
                            AbilityDsl.effects.setBaseMilitarySkill(parseInt(card.cardData.military_bonus)),
                            AbilityDsl.effects.setBasePoliticalSkill(parseInt(card.cardData.political_bonus))
                        ] : []
                    )
                }),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.detach(),
                    // @ts-ignore
                    AbilityDsl.actions.cardLastingEffect({ duration: Durations.Custom })
                ])
            })
        });
    }
}

TogashiHoshi.id = 'togashi-hoshi';

module.exports = TogashiHoshi;
