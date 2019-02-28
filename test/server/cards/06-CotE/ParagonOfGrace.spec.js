describe('Paragon of Grace', function() {
    integration(function() {
        describe('Paragon of Grace\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['paragon-of-grace', 'doji-whisperer'],
                        hand: ['way-of-the-crane']
                    },
                    player2: {
                        hand: ['fine-katana', 'ornate-fan']
                    }
                });
                this.paragonOfGrace = this.player1.findCardByName('paragon-of-grace');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');

                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.ornateFan = this.player2.findCardByName('ornate-fan');
            });

            it('should not trigger outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.paragonOfGrace);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if Paragon of Grace is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.paragonOfGrace);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if Paragon of Grace is not participating alone', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.paragonOfGrace, this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.paragonOfGrace);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should make your opponent choose a card to discard', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.paragonOfGrace],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.paragonOfGrace);
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.player2).toBeAbleToSelect(this.fineKatana);
                expect(this.player2).toBeAbleToSelect(this.ornateFan);
                this.player2.clickCard(this.ornateFan);
                expect(this.fineKatana.location).toBe('hand');
                expect(this.ornateFan.location).toBe('conflict discard pile');
                expect(this.getChatLogs(4)).toContain('player1 uses Paragon of Grace to make player2 discard 1 card');
            });

            it('should make your opponent discard a card at random if Paragon of Grace is honored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.paragonOfGrace],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.paragonOfGrace);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                let player2hand = this.player2.player.hand.size();
                this.player1.clickCard(this.paragonOfGrace);
                expect(this.player2).not.toHavePrompt('Choose a card to discard');
                expect(this.player2.player.hand.size()).toBe(player2hand - 1);
                expect(this.getChatLogs(4)).toContain('player1 uses Paragon of Grace to make player2 discard 1 card at random');
            });
        });
    });
});
