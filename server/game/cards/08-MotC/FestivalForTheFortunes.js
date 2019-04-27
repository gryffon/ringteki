const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class FestivalForTheFortunes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor each character',
            effect: 'honor each character',
            gameAction:
                AbilityDsl.actions.honor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === CardTypes.Character)
                }))
        });
    }
}

FestivalForTheFortunes.id = 'festival-for-the-fortunes';

module.exports = FestivalForTheFortunes;
