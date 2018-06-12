const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KnowTheWorld extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch a claimed ring with an unclaimed one',
            condition: context => _.any(this.game.rings, ring => ring.claimedBy === context.player.name) && _.any(this.game.rings, ring => ring.isUnclaimed()),
            effect: 'switch a claimed ring with an unclaimed one',
            handler: context => {
                // TODO: Does this need a condition? Add game action
                this.game.promptForRingSelect(context.player, {
                    context: context,
                    activePromptTitle: 'Choose a ring to return',
                    ringCondition: ring => ring.claimedBy === context.player.name,
                    onSelect: (player, ringToReturn) => {
                        this.game.promptForRingSelect(player, {
                            context: context,
                            activePromptTitle: 'Choose a ring to take',
                            ringCondition: ring => ring.isUnclaimed(),
                            onSelect: (player, ring) => {
                                this.game.addMessage('{0} returns {1} and takes {2}', player, ringToReturn, ring);
                                let events = [];
                                events.push(this.game.getEvent('onReturnRing', { ring: ringToReturn }, () => ringToReturn.resetRing()));
                                events.push(this.game.getEvent('unnamedEvent', {}, () => {
                                    ring.claimRing(player);
                                    if(player.allowGameAction('takeFateFromRings')) {
                                        player.modifyFate(ring.fate);
                                        ring.removeFate();
                                    }
                                }));
                                this.game.openEventWindow(events);
                                return true;
                            }
                        });
                        return true;
                    }
                });
            }
        });
    }
}

KnowTheWorld.id = 'know-the-world';

module.exports = KnowTheWorld;
