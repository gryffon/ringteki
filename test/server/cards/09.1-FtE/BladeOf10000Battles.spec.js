describe('Blade of 10,000 Battles', function() {
    integration(function() {
        describe('Blade of 10,000 Battles', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-tsuko', 'matsu-berserker'],
                        hand: ['blade-of-10-000-battles']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni']
                    }
                });
                this.matsuTsuko = this.player1.findCardByName('matsu-tsuko');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.bladeOf10000Battles = this.player1.findCardByName('blade-of-10-000-battles');
            });

            it('should only be attachable to your own unique characters', function() {
                this.player1.clickCard('blade-of-10-000-battles');
                expect(this.player1).toBeAbleToSelect(this.matsuTsuko);
                expect(this.player1).not.toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).not.toBeAbleToSelect(this.togashiYokuni);
            });
        }),

        describe('Blade of 10,000 Battles\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-tsuko'],
                        hand: ['blade-of-10-000-battles'],
                        conflictDiscard: ['fine-katana', 'ornate-fan'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        honor: 10
                    }
                });
                this.matsuTsuko = this.player1.findCardByName('matsu-tsuko');
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.bladeOf10000Battles = this.player1.findCardByName('blade-of-10-000-battles');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.player1.playAttachment(this.bladeOf10000Battles, this.matsuTsuko);
                this.noMoreActions();
            });

            it('should trigger when attached character wins the conflict and add the selected card to the hand', function() {
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.bladeOf10000Battles);
                this.player1.clickCard(this.bladeOf10000Battles);
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
                this.player1.clickCard(this.ornateFan);
                expect(this.ornateFan.location).toBe('hand');
            });

            it('should only trigger when attached character wins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: [this.togashiYokuni],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger when owner is not more honorable', function() {
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: []
                });
                this.player2.honor = 14;
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger when conflict discard pile is empty', function() {
                this.player1.moveCard(this.ornateFan, 'hand');
                this.player1.moveCard(this.fineKatana, 'hand');
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
