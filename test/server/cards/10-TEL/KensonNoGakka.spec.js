describe('Conflict Between Kin', function() {
    integration(function() {
        describe('Conflict Between Kin\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'asahina-artisan'],
                        provinces: ['shameful-display']
                    },
                    player2: {
                        inPlay: ['callow-delegate', 'doji-hotaru', 'doji-whisperer', 'keeper-initiate'],
                        provinces: ['kenson-no-gakka']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display');
                this.asahinaArtisan = this.player1.findCardByName('asahina-artisan');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.kensonNoGakka = this.player2.findCardByName('kenson-no-gakka');

                this.noMoreActions();
            });

            it('should honor each defender when the player loses a conflict at Kenson no Gakka', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: [this.dojiHotaru, this.keeperInitiate],
                    province: this.kensonNoGakka
                });

                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.pass();

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kensonNoGakka);

                this.player2.clickCard(this.kensonNoGakka);
                expect(this.dojiHotaru.isHonored).toBe(true);
                expect(this.keeperInitiate.isHonored).toBe(true);
                expect(this.callowDelegate.isHonored).toBe(false);
                expect(this.asahinaArtisan.isHonored).toBe(false);
            });

            it('should not honor each defender when the player wins a conflict at Kenson no Gakka', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brashSamurai],
                    defenders: [this.asahinaArtisan, this.keeperInitiate, this.dojiWhisperer],
                    province: this.kensonNoGakka
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.kensonNoGakka);

                this.player2.clickCard(this.kensonNoGakka);
                expect(this.keeperInitiate.isHonored).toBe(false);
                expect(this.callowDelegate.isHonored).toBe(false);
                expect(this.asahinaArtisan.isHonored).toBe(false);
            });

            it('should not trigger when you lose a conflict at another province', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.callowDelegate],
                    defenders: [this.brashSamurai]
                });

                this.player1.pass();
                this.player2.pass();

                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.kensonNoGakka);

                this.player2.clickCard(this.kensonNoGakka);
                expect(this.callowDelegate.isHonored).toBe(false);
            });
        });
    });
});
