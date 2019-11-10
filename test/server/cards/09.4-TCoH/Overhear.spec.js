describe('Overhear', function() {
    integration(function() {
        describe('Overhear\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'brash-samurai'],
                        hand: ['overhear']
                    },
                    player2: {
                        hand: ['fine-katana', 'ornate-fan', 'banzai']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.overhear = this.player1.findCardByName('overhear');

                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.ornateFan = this.player2.findCardByName('ornate-fan');
                this.banzai = this.player2.findCardByName('banzai');
            });

            it('should not trigger outside of a political conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.overhear);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.overhear);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should put a random card from your opponent\'s hand on top of their deck, and correctly log it', function() {
                let handSize = this.player2.hand.length;
                let deckSize = this.player2.conflictDeck.length;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                expect(this.player2.hand.length).toBe(handSize - 1);
                expect(this.player2.conflictDeck.length).toBe(deckSize + 1);
                expect([
                    'player1 sees Fine Katana',
                    'player1 sees Ornate Fan',
                    'player1 sees Banzai!'
                ]).toContain(this.getChatLogs(1)[0]);
                expect(
                    `player1 sees ${ this.player2.conflictDeck[0].name }`
                ).toEqual(this.getChatLogs(1)[0]);
            });

            it('should not prompt to resolve a second time if you do not have a participating courtier', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to resolve a second time if you have a participating courtier', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Give 1 honor to resolve this ability again');
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should give 1 honor to your opponent if you choose to resolve again', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                let honorP1 = this.player1.player.honor;
                let honorP2 = this.player2.player.honor;
                this.player1.clickPrompt('Give 1 honor to resolve this ability again');
                expect(this.player1.player.honor).toBe(honorP1 - 1);
                expect(this.player2.player.honor).toBe(honorP2 + 1);
                expect(this.getChatLogs(3)).toContain('player1 chooses to give an honor to player2 to resolve Overhear again');
            });

            it('should end if you choose not to resolve again', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                let honorP1 = this.player1.player.honor;
                let honorP2 = this.player2.player.honor;
                this.player1.clickPrompt('Done');
                expect(this.player1.player.honor).toBe(honorP1);
                expect(this.player2.player.honor).toBe(honorP2);
                expect(this.getChatLogs(3)).toContain('player1 chooses not to give an honor to player2 to resolve Overhear again');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should resolve again if you choose to do so', function() {
                let handSize = this.player2.hand.length;
                let deckSize = this.player2.conflictDeck.length;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.overhear);
                this.player1.clickPrompt('Give 1 honor to resolve this ability again');
                expect(this.player2.hand.length).toBe(handSize - 2);
                expect(this.player2.conflictDeck.length).toBe(deckSize + 2);
            });
        });
    });
});

