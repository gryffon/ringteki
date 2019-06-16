describe('Dispatch', function() {
    integration(function() {
        describe('Dispatch\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth','miya-mystic','moto-horde'],
                        hand: ['dispatch']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.noMoreActions();
                this.horde = this.player1.findCardByName('moto-horde');
            });

            it('should only target Unicorn characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-youth'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('dispatch');
                expect(this.player1).not.toBeAbleToSelect('miya-mystic');
                expect(this.player1).toBeAbleToSelect('moto-youth');
                expect(this.player1).toBeAbleToSelect('moto-horde');
                expect(this.getChatLogs(1)).toContain('player1 plays Dispatch to choose a unicorn character they control to move into a conflict or home');
            });

            it('should correctly move character in the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-youth'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('dispatch');
                this.player1.clickCard('moto-horde');
                expect(this.horde.isParticipating()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 chooses to move Moto Horde into the conflict');
            });

            it('should correctly send character home', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-horde'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('dispatch');
                this.player1.clickCard('moto-horde');
                expect(this.horde.isParticipating()).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 chooses to send Moto Horde home');
            });
        });
    });
});
