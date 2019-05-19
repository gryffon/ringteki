const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AkodoMakoto extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove fate/discard character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.player && context.source.isParticipating();
                }
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card) => {
                    return card.hasTrait('courtier') && card.isParticipating();
                },
                gameAction: AbilityDsl.actions.conditional({
                    condition: context => context.target.fate > 0,
                    trueGameAction: AbilityDsl.actions.removeFate(),
                    falseGameAction: AbilityDsl.actions.discardFromPlay()
                })
            }
        });
    }
}

AkodoMakoto.id = 'akodo-makoto';

module.exports = AkodoMakoto;
