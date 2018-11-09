describe('Stolen Breath', function() {
    integration(function() {
        describe('Stolen Breath\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-kazue', 'otomo-courtier'],
                        dynastyDeck: ['favorable-ground']
                    },
                    player2: {
                        hand: ['stolen-breath'],
                        provinces: ['kuroi-mori']
                    }
                });
                this.togashiKazue = this.player1.findCardByName('togashi-kazue');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori');
                this.stolenBreath = this.player2.findCardByName('stolen-breath');
            });

            it('should not be playable during a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['otomo-courtier'],
                    defenders: []
                });
                this.player2.clickCard(this.stolenBreath);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('once attached', function () {
                beforeEach(function () {
                    this.player1.pass();
                    this.player2.playAttachment(this.stolenBreath.id, this.togashiKazue);
                    this.noMoreActions();
                });

                it('should not allow attached character to be declared in a political conflict', function () {
                    expect(this.player1).toHavePrompt('Initiate Conflict');
                    this.player1.clickRing('air');
                    this.player1.clickRing('air');
                    expect(this.game.currentConflict.conflictType).toBe('political');
                    this.player1.clickCard(this.togashiKazue);
                    expect(this.togashiKazue.inConflict).toBe(false);
                    expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
                });

                it('should remove attached character from the conflict if it switches from military to political', function () {
                    this.player1.clickRing('earth');
                    this.player1.clickRing('earth');
                    this.player1.clickCard(this.togashiKazue);
                    expect(this.game.currentConflict.conflictType).toBe('military');
                    expect(this.togashiKazue.inConflict).toBe(true);
                    expect(this.game.currentConflict.attackers).toContain(this.togashiKazue);
                    expect(this.togashiKazue.bowed).toBe(false);
                    this.player1.clickRing('earth');
                    expect(this.game.currentConflict.conflictType).toBe('political');
                    expect(this.togashiKazue.inConflict).toBe(false);
                    expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
                    expect(this.togashiKazue.bowed).toBe(false);
                });

                it('should not allow attached character to move into a political conflict', function () {
                    this.initiateConflict({
                        type: 'political',
                        attackers: ['otomo-courtier'],
                        defenders: []
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.favorableGround);
                    expect(this.player1).not.toBeAbleToSelect(this.togashiKazue);
                });

                it('should send targeted character home if the conflict switches from military to political', function () {
                    this.initiateConflict({
                        type: 'military',
                        province: this.kuroiMori,
                        attackers: [this.togashiKazue],
                        defenders: []
                    });
                    expect(this.game.currentConflict.attackers).toContain(this.togashiKazue);
                    expect(this.togashiKazue.bowed).toBe(false);
                    this.player2.clickCard('kuroi-mori');
                    this.player2.clickPrompt('Switch the conflict type');
                    expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
                    expect(this.togashiKazue.inConflict).toBe(false);
                    expect(this.togashiKazue.bowed).toBe(true);
                });
            });

        });
    });
});
