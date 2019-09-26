const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

const { Locations } = require('../../Constants');

class InvokeTheDivine extends DrawCard {
    setupCardAbilities() {
        const getSelectCardAction = (fate, spellsCast) => AbilityDsl.actions.selectCard({
            location: Locations.Hand,
            cardCondition: card => card.hasTrait('spell') && card.getCost() < fate,
            optional: spellsCast > 0,
            gameAction: AbilityDsl.actions.playCard({
                resetOnCancel: true,
                postHandler: context => {
                    if(spellsCast < 2) {
                        getSelectCardAction(fate - context.source.getCost(), spellsCast + 1).resolve(null, context);
                    }
                }
            })
        });
        this.action({
            title: 'Play 3 spells',
            effect: 'play 3 spells from their hand',
            gameAction: getSelectCardAction(5, 0)
        });
    }
}

InvokeTheDivine.id = 'invoke-the-divine';

module.exports = InvokeTheDivine;

