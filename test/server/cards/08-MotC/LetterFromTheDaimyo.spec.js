describe('Letter from the Daimyo', function() {
    integration(function() {
        describe('Letter From the Daimyo', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['letter-from-the-daimyo','fine-katana']
                    },
                    player2: {
                        hand: ['banzai', 'charge','political-rival']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.letterFromTheDaimyo = this.player1.playAttachment('letter-from-the-daimyo', this.dojiWhisperer);

                this.charge = this.player2.findCardByName('charge');
                this.politicalRival = this.player2.findCardByName('political-rival');
                this.noMoreActions();
            });

            it('should not work after winning a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('fine-katana');
                this.player1.clickCard(this.dojiWhisperer);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should work after winning a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.letterFromTheDaimyo);
            });

            it('should not work after losing a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.clickCard(this.politicalRival);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should be sacrified as a cost', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickCard(this.letterFromTheDaimyo);
                expect(this.letterFromTheDaimyo.location).toBe('conflict discard pile');
            });

            it('should make the opponent choose 2 cards to discard', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickCard(this.letterFromTheDaimyo);
                expect(this.player2).toHavePrompt('Choose 2 cards to discard');
                expect(this.player2).toBeAbleToSelect('political-rival');
                expect(this.player2).toBeAbleToSelect('charge');
                expect(this.player2).toBeAbleToSelect('banzai');
            });

            it('should discard the 2 cards', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickCard(this.letterFromTheDaimyo);
                this.player2.clickCard(this.charge);
                this.player2.clickCard(this.politicalRival);
                this.player2.clickPrompt('Done');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.politicalRival.location).toBe('conflict discard pile');
                expect(this.letterFromTheDaimyo.location).toBe('conflict discard pile');
            });
        });
    });
});
