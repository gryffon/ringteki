const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilitDsl = require('../../abilitydsl');

class MiyaLibrary extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Replace Miya Library for a faceup imperial character',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'Search the top five card for your dynasty deck for an imperial character', 
            handler: context => {
                
            }
        });
    }
}

MiyaLibrary.id = 'miya-library';

module.exports = MiyaLibrary;
