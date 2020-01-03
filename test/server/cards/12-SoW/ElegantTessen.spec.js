describe('Elegant Tessen', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai', 'doji-challenger', 'giver-of-gifts'],
                    hand: ['elegant-tessen'],
                    provinces: ['illustrious-forge']
                },
                player2: {
                    inPlay: ['callow-delegate']
                }
            });

            this.tessen = this.player1.findCardByName('elegant-tessen');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.giver = this.player1.findCardByName('giver-of-gifts');
            this.callow = this.player2.findCardByName('callow-delegate');
            this.forge = this.player1.findCardByName('illustrious-forge');

            this.whisperer.bowed = true;
            this.brash.bowed = false;
            this.challenger.bowed = true;
            this.callow.bowed = true;
        });

        it('should allow attaching on anyone', function() {
            this.player1.clickCard(this.tessen);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.callow);
        });

        it('should react on attaching to ready a character who costs <= 2 and is bowed', function() {
            expect(this.whisperer.bowed).toBe(true);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tessen);
            this.player1.clickCard(this.tessen);
            expect(this.whisperer.bowed).toBe(false);
        });

        it('should not react on attaching to a character who costs <= 2 and is readied', function() {
            expect(this.brash.bowed).toBe(false);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.brash);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not react on attaching to a character who costs > 2 and is bowed', function() {
            expect(this.challenger.bowed).toBe(true);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.challenger);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should work on opponent\'s characters', function() {
            expect(this.callow.bowed).toBe(true);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.callow);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tessen);
            this.player1.clickCard(this.tessen);
            expect(this.callow.bowed).toBe(false);
        });

        it('should not react when being moved', function() {
            expect(this.whisperer.bowed).toBe(true);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.brash);
            this.player2.pass();
            this.player1.clickCard(this.giver);
            this.player1.clickCard(this.tessen);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should react when being put into play', function() {
            expect(this.whisperer.bowed).toBe(true);
            this.callow.bowed = false;
            this.player1.reduceDeckToNumber('conflict', 0);
            this.player1.moveCard(this.tessen, 'conflict deck');

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.callow],
                type: 'military',
                province: this.forge
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.forge);
            this.player1.clickCard(this.forge);
            expect(this.player1).toHavePromptButton('Elegant Tessen');
            this.player1.clickPrompt('Elegant Tessen');
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tessen);
            this.player1.clickCard(this.tessen);
            expect(this.whisperer.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Choose defenders');
        });
    });
});
