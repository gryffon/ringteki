const DrawCard = require('../../drawcard.js');

class AkodoGunso extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Refill province faceup',
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source && 
                                                      ['province 1', 'province 2', 'province 3', 'province 4'].includes(event.originalLocation)
            },
            message: 'refill the province face up',
            handler: context => {
                let province = context.player.getSourceList(context.event.originalLocation);
                let card = province.find(card => card.isDynasty);
                if(card) {
                    card.facedown = false;
                }
            }
        });
    }
}

AkodoGunso.id = 'akodo-gunso';

module.exports = AkodoGunso;
