describe('Written in the Stars', function() {
    integration(function() {
        describe('Written in the Stars\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        hand: ['written-in-the-stars']
                    },
                    player2: {
                    }
                });
                this.writtenInTheStars = this.player1.findCardByName('written-in-the-stars');
                this.player1.claimRing('air');
                this.game.rings.earth.fate = 1;
                this.game.rings.void.fate = 2;
            });

            it('should prompt to select one', function() {
                this.player1.clickCard(this.writtenInTheStars);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Place one fate on each unclaimed ring with no fate');
                expect(this.player1).toHavePromptButton('Remove one fate from each unclaimed ring');
            });

            it('should place 1 fate on each unclaimed ring with no fate if chosen', function() {
                this.player1.clickCard(this.writtenInTheStars);
                this.player1.clickPrompt('Place one fate on each unclaimed ring with no fate');
                expect(this.game.rings.air.fate).toBe(0);
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.game.rings.earth.fate).toBe(1);
                expect(this.game.rings.void.fate).toBe(2);
                expect(this.game.rings.water.fate).toBe(1);
            });

            it('should remove 1 fate from each unclaimed ring if chosen', function() {
                let fate = this.player1.player.fate;
                this.player1.clickCard(this.writtenInTheStars);
                this.player1.clickPrompt('Remove one fate from each unclaimed ring');
                expect(this.game.rings.air.fate).toBe(0);
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.game.rings.earth.fate).toBe(0);
                expect(this.game.rings.void.fate).toBe(1);
                expect(this.game.rings.water.fate).toBe(0);
                expect(this.player1.player.fate).toBe(fate - 1); // less the fate cost of the card
                expect(this.getChatLogs(1)).toContain('player1 plays Written in the Stars to remove 1 fate from Earth Ring and Void Ring');
            });
        });
    });
});
