describe('Kitsuki Shomon', function() {
    integration(function() {
        describe('Kitsuki Shomon\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-shomon', 'doomed-shugenja', 'togashi-yokuni'],
                        dynastyDiscard: ['favorable-ground']
                    },
                    player2: {
                        dynastyDiscard: ['young-rumormonger'],
                        hand: ['way-of-the-scorpion', 'mark-of-shame', 'charge']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.youngRumormonger = this.player2.placeCardInProvince('young-rumormonger');
                this.kitsukiShomon = this.player1.findCardByName('kitsuki-shomon');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
                this.kitsukiShomon.bow();
                this.togashiYokuni.bow();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doomed-shugenja'],
                    defenders: []
                });
            });

            it('should trigger when another character is dishonored', function() {
                this.player2.clickCard('way-of-the-scorpion');
                expect(this.player2).toHavePrompt('Way of the Scorpion');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.doomedShugenja.isDishonored).toBe(false);
                expect(this.kitsukiShomon.isDishonored).toBe(true);
                expect(this.kitsukiShomon.bowed).toBe(false);
            });

            it('should dishonor and ready Yokuni if Shomon\'s ability is copied', function() {
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.kitsukiShomon);
                this.player2.clickCard('way-of-the-scorpion');
                expect(this.player2).toHavePrompt('Way of the Scorpion');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                expect(this.player1).toBeAbleToSelect(this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Pass');
                expect(this.doomedShugenja.isDishonored).toBe(false);
                expect(this.kitsukiShomon.isDishonored).toBe(false);
                expect(this.kitsukiShomon.bowed).toBe(true);
                expect(this.togashiYokuni.isDishonored).toBe(true);
                expect(this.togashiYokuni.bowed).toBe(false);
            });

            it('should not trigger when Shomon is dishonored', function() {
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.inConflict).toBe(true);
                this.player2.clickCard('way-of-the-scorpion');
                this.player2.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.isDishonored).toBe(true);
                expect(this.kitsukiShomon.bowed).toBe(true);
            });

            it('should not trigger if Shomon is currently dishonored', function() {
                this.kitsukiShomon.dishonor();
                expect(this.kitsukiShomon.isDishonored).toBe(true);
                this.player2.clickCard('way-of-the-scorpion');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.isDishonored).toBe(true);
                expect(this.kitsukiShomon.bowed).toBe(true);
            });

            it('should not ready Shomon if the dishonor is redirected', function() {
                this.player2.clickCard('charge');
                expect(this.player2).toHavePrompt('Charge!');
                expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                this.player2.clickCard(this.youngRumormonger);
                expect(this.youngRumormonger.location).toBe('play area');
                this.player1.pass();
                this.player2.clickCard('way-of-the-scorpion');
                expect(this.player2).toHavePrompt('Way of the Scorpion');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                this.player2.clickCard(this.youngRumormonger);
                this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.isDishonored).toBe(true);
                expect(this.kitsukiShomon.isDishonored).toBe(false);
                expect(this.kitsukiShomon.bowed).toBe(true);
            });

            it('should not stop Mark of Shame if the pre-then dishonor is redirected', function() {
                this.kitsukiShomon.honor();
                expect(this.kitsukiShomon.isHonored).toBe(true);
                this.markOfShame = this.player2.playAttachment('mark-of-shame', this.doomedShugenja);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.markOfShame);
                this.player2.clickCard(this.markOfShame);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.doomedShugenja.isDishonored).toBe(true);
                expect(this.kitsukiShomon.isDishonored).toBe(false);
                expect(this.kitsukiShomon.isHonored).toBe(false);
                expect(this.kitsukiShomon.bowed).toBe(false);
            });

            it('should not stop Mark of Shame if the pre-then dishonor is redirected back to the original target', function() {
                this.doomedShugenja.honor();
                expect(this.doomedShugenja.isHonored).toBe(true);
                this.player2.clickCard('charge');
                expect(this.player2).toHavePrompt('Charge!');
                expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                this.player2.clickCard(this.youngRumormonger);
                expect(this.youngRumormonger.location).toBe('play area');
                this.player1.pass();
                this.markOfShame = this.player2.playAttachment('mark-of-shame', this.doomedShugenja);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.markOfShame);
                this.player2.clickCard(this.markOfShame);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                this.player2.clickCard(this.youngRumormonger);
                this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.isDishonored).toBe(true);
                expect(this.kitsukiShomon.isDishonored).toBe(false);
                expect(this.kitsukiShomon.bowed).toBe(true);
            });
        });
    });
});
