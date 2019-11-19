describe('Sharpen the Mind', function() {
    integration(function() {
        describe('Sharpen the Mind\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai'],
                        hand: ['sharpen-the-mind', 'fine-katana', 'ornate-fan'],
                        conflictDiscard: ['guidance-of-the-ancestors']
                    },
                    player2: {
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.sharpenTheMind = this.player1.findCardByName('sharpen-the-mind');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.guidanceOfTheAncestors = this.player1.findCardByName('guidance-of-the-ancestors');

                this.player1.playAttachment(this.sharpenTheMind, this.brashSamurai);
            });

            it('should not be triggerable outside of a conflict', function() {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player2.clickCard(this.sharpenTheMind);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to choose a card to discard', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                expect(this.player1).toHavePrompt('Select card to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
            });

            it('should only prompt to discard from hand', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                expect(this.player1).toHavePrompt('Select card to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.guidanceOfTheAncestors);
            });


            it('should discard the chosen card', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
            });

            it('should give the attached character +3/+3', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.fineKatana);
                expect(this.brashSamurai.getMilitarySkill()).toBe(this.brashSamurai.printedMilitarySkill + 3);
                expect(this.brashSamurai.getPoliticalSkill()).toBe(this.brashSamurai.printedPoliticalSkill + 3);
                expect(this.getChatLogs(3)).toContain('player1 uses Sharpen the Mind, discarding Fine Katana to give +3military/+3political to Brash Samurai');
            });
        });
    });
});
