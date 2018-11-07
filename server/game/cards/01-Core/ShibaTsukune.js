const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');

class ShibaTsukune extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Resolve 2 rings',
            when : {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            effect: 'resolve up to 2 ring effects',
            handler: context => this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose a ring to resolve',
                context: context,
                ringCondition: ring => !ring.claimed,
                onSelect: (player, firstRing) => {
                    if(_.size(_.filter(this.game.rings, ring => !ring.claimed)) > 1) {
                        this.game.promptForRingSelect(player, {
                            activePromptTitle: 'Choose a second ring to resolve, or click Done',
                            ringCondition: ring => !ring.claimed && ring !== firstRing,
                            context: context,
                            optional: true,
                            onMenuCommand: player => {
                                this.game.addMessage('{0} resolves {1}', player, firstRing);
                                let event = this.game.actions.resolveRingEffect().getEvent(firstRing, this.game.getFrameworkContext(player));
                                this.game.openThenEventWindow(event);
                                return true;
                            },
                            onSelect: (player, secondRing) => {
                                this.game.addMessage('{0} resolves {1}', player, [firstRing, secondRing]);
                                let action = this.game.actions.resolveRingEffect();
                                action.setTarget([firstRing, secondRing]);
                                this.game.openThenEventWindow(action.getEventArray(this.game.getFrameworkContext(player)));
                                return true;
                            }
                        });
                    } else {
                        this.game.addMessage('{0} resolves {1}', context.player, firstRing);
                        let event = this.game.actions.resolveRingEffect().getEvent(firstRing, this.game.getFrameworkContext(player));
                        this.game.openThenEventWindow(event);
                    }
                    return true;
                }
            })
        });
    }
}

ShibaTsukune.id = 'shiba-tsukune';

module.exports = ShibaTsukune;
