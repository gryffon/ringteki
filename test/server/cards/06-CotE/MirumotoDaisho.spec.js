describe('Mirumoto Daisho', function() {
    integration(function() {
        describe('Mirumoto Daisho', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['mirumoto-daisho','fine-katana','ornate-fan']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.mirumotoDaisho = this.player1.findCardByName('mirumoto-daisho');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should be attachable to all', function() {
                this.player1.clickCard(this.mirumotoDaisho);
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.mirumotoDaisho);
            });

            it('should give +2 mil, +2 pol', function() {
                let militarySkill = this.mirumotoRaitsugu.getMilitarySkill();
                let politicalSkill = this.mirumotoRaitsugu.getPoliticalSkill();
                this.player1.clickCard(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.getMilitarySkill()).toBe(militarySkill + 2);
                expect(this.mirumotoRaitsugu.getPoliticalSkill()).toBe(politicalSkill + 2);
            });

            it('if character already has 2 restricted attachments, the controller should be prompted to remove', function() {
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.fineKatana);
                this.player2.pass();
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.ornateFan);
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoDaisho.hasKeyword('Restricted')).toBe(true);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.mirumotoDaisho);
                expect(this.player1).toHavePrompt('Choose an attachment to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
                expect(this.player1).toBeAbleToSelect(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoDaisho);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.fineKatana);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.ornateFan);
                expect(this.mirumotoRaitsugu.attachments.toArray()).not.toContain(this.mirumotoDaisho);
                expect(this.mirumotoDaisho.location).toBe('conflict discard pile');
            });

            it('if character already has 1 restricted attachment it should be discarded', function() {
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.fineKatana);
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.mirumotoDaisho);
                expect(this.mirumotoRaitsugu.attachments.toArray()).not.toContain(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
            });

            it('if a restricted attachment is attached after mirumoto daisho, it should be discarded', function() {
                this.player1.clickCard(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).toContain(this.mirumotoDaisho);
                this.player2.pass();
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.attachments.toArray()).not.toContain(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
            });

            it('during a duel the attached character is participating, the opponent should not be able to bid 1 or 5', function() {
                this.player1.clickCard(this.mirumotoDaisho);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Choose your bid for the duel\nMirumoto Raitsugu: 5 vs 0: Doji Whisperer');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('4');
                expect(this.player1).toHavePromptButton('5');
                expect(this.player2).toHavePrompt('Choose your bid for the duel\nMirumoto Raitsugu: 5 vs 0: Doji Whisperer');
                expect(this.player2).not.toHavePromptButton('1');
                expect(this.player2).toHavePromptButton('2');
                expect(this.player2).toHavePromptButton('3');
                expect(this.player2).toHavePromptButton('4');
                expect(this.player2).not.toHavePromptButton('5');
            });
        });
    });
});
