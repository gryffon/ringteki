describe('Humble Magistrate', function() {
    integration(function() {
        describe('Humble Magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['humble-magistrate', 'bayushi-kachiko'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['kudaka', 'vanguard-warrior']
                    }
                });
                this.HumbleMagistrate = this.player1.findCardByName('humble-magistrate');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['humble-magistrate', 'bayushi-kachiko'],
                    defenders: ['kudaka', 'vanguard-warrior']
                });
                this.conflict = this.game.currentConflict;
            });

            it('shouldn\'t count kachiko\'s skill', function() {
                expect(this.conflict.attackerSkill).toBe(2);
            });

            it('Shouldn\'t count kudaka\'s skill', function() {
                expect(this.conflict.defenderSkill).toBe(2);
            });
        });
    });
});
