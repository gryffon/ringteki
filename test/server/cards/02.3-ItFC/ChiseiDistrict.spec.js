describe('Chisei District', function () {
    integration(function () {
        describe('Chisei District\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'seppun-guardsman']
                    },
                    player2: {
                        dynastyDeck: ['chisei-district']
                    }
                });
                this.chisei = this.player2.placeCardInProvince('chisei-district', 'province 1');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.noMoreActions();
            });

            it('should not allow military conflicts to be declared against it\'s province', function () {
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.game.currentConflict.conflictProvince).toBe(this.shamefulDisplay);
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.game.currentConflict.conflictProvince).toBe(this.shamefulDisplay);
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.game.currentConflict.conflictProvince).toBe(this.shamefulDisplay);
                expect(this.player1).toHavePrompt('Political Earth Conflict');
            });

            it('should allow political conflicts to be declared against it\'s province', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be selected for a military conflict', function() {
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.shamefulDisplay.inConflict).toBe(false);
            });

            it('should not allow changing the conflict type if selected when declaring a conflict', function() {
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.shamefulDisplay.inConflict).toBe(true);
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.ring.element).toBe('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
            });
        });
    });
});

