describe('Asahina Maeko', function() {
    integration(function() {
        describe('Asahina Maeko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-maeko', 'daidoji-uji'],
                        hand: ['fine-katana'],
                        dynastyDiscard: ['doji-whisperer'],
                        fate: 10,
                        honor: 10
                    },
                    player2: {
                        inPlay: ['callow-delegate', 'brash-samurai'],
                        hand: ['way-of-the-crane', 'ornate-fan','steward-of-law'],
                        conflictDiscard: ['right-hand-of-the-emperor'],
                        fate: 10,
                        honor: 15
                    }
                });
                this.maeko = this.player1.findCardByName('asahina-maeko');
                this.uji = this.player1.findCardByName('daidoji-uji');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.katana = this.player1.findCardByName('fine-katana');

                this.callow = this.player2.findCardByName('callow-delegate');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.crane = this.player2.findCardByName('way-of-the-crane');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.rightHand = this.player2.findCardByName('right-hand-of-the-emperor');

                this.player1.placeCardInProvince(this.whisperer, 'province 1');
                this.uji.honor();
                this.brash.bowed = true;
            });

            it('should not work outside of conflicts', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.maeko);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should work during a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                expect(this.getChatLogs(3)).toContain('player1 uses Asahina Maeko to increase the cost of cards this conflict for both players');
            });

            it('should increase the cost of conflict characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                let p2fate = this.player2.fate;

                this.player2.clickCard(this.steward);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.player2.fate).toBe(p2fate - 2);
            });

            it('should increase the cost of attachments', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                let p2fate = this.player2.fate;

                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.callow);
                expect(this.player2.fate).toBe(p2fate - 1);
            });

            it('should increase the cost of events', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                let p2fate = this.player2.fate;

                this.player2.clickCard(this.crane);
                this.player2.clickCard(this.callow);
                expect(this.player2.fate).toBe(p2fate - 1);
            });

            it('should increase the cost of cards played from discard', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                let p2fate = this.player2.fate;

                this.player2.clickCard(this.rightHand);
                this.player2.clickCard(this.brash);
                this.player2.clickPrompt('Done');
                expect(this.player2.fate).toBe(p2fate - 4);
            });

            it('should increase the cost of cards for both players', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                this.player2.pass();

                let p1fate = this.player1.fate;
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.uji);
                expect(this.player1.fate).toBe(p1fate - 1);
            });

            it('should increase the cost of cards played as if from hand', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.uji],
                    defenders: [this.callow]
                });
                this.player2.pass();
                this.player1.clickCard(this.maeko);
                this.player2.pass();

                let p1fate = this.player1.fate;
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1.fate).toBe(p1fate - 2);
            });
        });
    });
});
