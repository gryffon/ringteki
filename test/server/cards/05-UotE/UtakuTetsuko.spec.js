describe('Utaku Tetsuko', function() {
    integration(function() {
        describe('Utaku Tetsuko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['utaku-tetsuko'],
                        hand: ['fine-katana'],
                        fate: 3
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['ornate-fan','steward-of-law'],
                        fate: 2
                    }
                });
                this.noMoreActions();
            });

            it('should not work on defense', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doji-whisperer'],
                    defenders: ['utaku-tetsuko']
                });
                this.player1.pass();
                this.player2.clickCard('ornate-fan');
                this.player2.clickCard('doji-whisperer');
                expect(this.player2.fate).toBe(2);
            });

            it('should only work on offense', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['utaku-tetsuko'],
                    defenders: ['doji-whisperer']
                });
                this.player2.clickCard('steward-of-law');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.player2.fate).toBe(0);
            });

            it('should only apply to opponent cards', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['utaku-tetsuko'],
                    defenders: ['doji-whisperer']
                });
                this.player2.clickCard('ornate-fan');
                this.player2.clickCard('doji-whisperer');
                expect(this.player2.fate).toBe(1);
                this.player1.clickCard('fine-katana');
                this.player1.clickCard('utaku-tetsuko');
                expect(this.player1.fate).toBe(3);
            });
        });
    });
});
