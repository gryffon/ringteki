describe('Iron Crane Legion', function() {
    integration(function() {
        describe('Iron Crane Legion\'s constant ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['iron-crane-legion']
                    },
                    player2: {
                        hand: ['unmask', 'fine-katana', 'ornate-fan']
                    }
                });
                this.ironCraneLegion = this.player1.findCardByName('iron-crane-legion');
                this.unmask = this.player2.findCardByName('unmask');
            });

            it('should have no effect outside of a conflict', function() {
                expect(this.ironCraneLegion.printedMilitarySkill).toBe(0);
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.ironCraneLegion],
                        defenders: []
                    });
                });

                it('should give Iron Crane Legion a base military skill equal to the number of cards your opponent has in hand', function() {
                    expect(this.ironCraneLegion.getBaseMilitarySkill()).toBe(this.player2.hand.length);
                });

                it('should set military skill to zero when Unmask is played on Iron Crane Legion', function() {
                    this.player2.clickCard(this.unmask);
                    this.player2.clickCard(this.ironCraneLegion);
                    expect(this.ironCraneLegion.printedMilitarySkill).toBe(0);
                });
            });
        });
    });
});

