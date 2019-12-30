describe('Chrysanthemum Steward', function() {
    integration(function() {
        describe('Chrysanthemum Steward\'s triggered ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['chrysanthemum-steward', 'solemn-scholar'],
                        conflictDiscard: ['court-games']
                    },
                    player2: {
                        conflictDiscard: ['assassination', 'for-shame']
                    }
                });

                this.chrysanthemumSteward = this.player1.findCardByName('chrysanthemum-steward');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.courtGames = this.player1.findCardByName('court-games');

                this.assassination = this.player2.findCardByName('assassination');
                this.forShame = this.player2.findCardByName('for-shame');
                this.noMoreActions();
            });

            it('should let you trigger Steward when they are participating in a conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.chrysanthemumSteward],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.chrysanthemumSteward);
                expect(this.player1).toHavePrompt('Choose a card');
            });

            it('should not be triggerable when not participating', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.solemnScholar],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.chrysanthemumSteward);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should let you choose a card in your opponents conflict discard pile', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.chrysanthemumSteward],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.chrysanthemumSteward);
                expect(this.player1).toHavePrompt('Choose a card');

                expect(this.player1).toBeAbleToSelect(this.assassination);
                expect(this.player1).toBeAbleToSelect(this.forShame);
                expect(this.player1).not.toBeAbleToSelect(this.courtGames);
            });

            it('should move the chosen card to the top of the deck', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.chrysanthemumSteward],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.chrysanthemumSteward);
                expect(this.player1).toHavePrompt('Choose a card');

                this.player1.clickCard(this.assassination);
                expect(this.getChatLogs(5)).toContain('player1 uses Chrysanthemum Steward to move Assassination to player2\'s conflict deck');
                expect(this.assassination.location).toBe('conflict deck');
            });
        });
    });
});
