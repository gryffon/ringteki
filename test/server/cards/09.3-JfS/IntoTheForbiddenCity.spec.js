describe('Into the Forbidden City', function() {
    integration(function() {
        describe('Into the Forbidden City\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['fine-katana', 'finger-of-jade']
                    },
                    player2: {
                        inPlay: ['tattooed-wanderer'],
                        hand: ['ornate-fan'],
                        provinces: ['into-the-forbidden-city']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.fingerOfJade = this.player1.findCardByName('finger-of-jade');

                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.ornateFan = this.player2.findCardByName('ornate-fan');
                this.intoTheForbiddenCity = this.player2.findCardByName('into-the-forbidden-city');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');

                this.player1.playAttachment(this.fineKatana, this.brashSamurai);
                this.player2.playAttachment(this.ornateFan, this.tattooedWanderer);
                this.player1.playAttachment(this.fingerOfJade, this.dojiWhisperer);
            });

            it('should not trigger when it is not the conflict province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.shamefulDisplay
                });
                this.player2.clickCard(this.intoTheForbiddenCity);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt you to choose an attachment on an attacking character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.effectiveDeception
                });
                this.player2.clickCard(this.intoTheForbiddenCity);
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toBeAbleToSelect(this.fineKatana);
                expect(this.player2).not.toBeAbleToSelect(this.fingerOfJade);
                expect(this.player2).not.toBeAbleToSelect(this.ornateFan);
            });

            it('should discard the chosen attachment', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.effectiveDeception
                });
                this.player2.clickCard(this.intoTheForbiddenCity);
                this.player2.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.getChatLogs(3)).toContain('player2 uses Into the Forbidden City to discard Fine Katana');
            });
        });
    });
});
