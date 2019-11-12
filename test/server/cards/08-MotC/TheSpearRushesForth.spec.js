describe('The Spear Rushes Forth', function() {
    integration(function() {
        describe('The Spear Rushes Forth\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai','kakita-kaezin','doji-whisperer'],
                        hand: ['the-spear-rushes-forth','young-harrier']
                    },
                    player2: {
                        inPlay: ['doji-challenger','kakita-yoshi']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.kakitaKaezin = this.player1.findCardByName('kakita-kaezin');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.youngHarrier = this.player1.findCardByName('young-harrier');
                this.theSpearRushesForth = this.player1.findCardByName('the-spear-rushes-forth');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.kakitaYoshi = this.player2.findCardByName('kakita-yoshi');
                this.noMoreActions();
                this.kakitaKaezin.honor();
            });

            it('should not work if the player controls no participating honored characters', function() {
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.dojiChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.theSpearRushesForth);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should work if the player controls a participating honored character', function() {
                this.brashSamurai.honor();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.dojiChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.theSpearRushesForth);
                expect(this.player1).toHavePrompt('The Spear Rushes Forth');
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should discard an honored status token as a cost', function() {
                this.brashSamurai.honor();
                this.dojiChallenger.honor();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.dojiChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.theSpearRushesForth);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickPrompt('Pay Costs First');
                expect(this.player1).toBeAbleToSelect(this.kakitaKaezin);
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.kakitaKaezin.isHonored).toBe(false);
            });

            it('should bow targeted character', function() {
                this.brashSamurai.honor();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.dojiChallenger, this.kakitaYoshi]
                });
                this.player2.pass();
                this.player1.clickCard(this.theSpearRushesForth);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.kakitaYoshi);
                this.player1.clickCard(this.kakitaYoshi);
                this.player1.clickCard(this.kakitaKaezin);

                expect(this.getChatLogs(5)).toContain('player1 plays The Spear Rushes Forth, discarding Kakita Kaezin\'s status token to bow Kakita Yoshi')
                expect(this.kakitaYoshi.bowed).toBe(true);
                expect(this.kakitaKaezin.isHonored).toBe(false);
            });

            it('should work even if young harrier is present in the conflict', function() {
                this.brashSamurai.honor();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.dojiChallenger, this.kakitaYoshi]
                });
                this.player2.pass();
                this.player1.clickCard(this.youngHarrier);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player2.pass();
                this.player1.clickCard(this.youngHarrier);
                this.player2.pass();
                this.player1.clickCard(this.theSpearRushesForth);
                this.player1.clickCard(this.kakitaYoshi);
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.kakitaYoshi.bowed).toBe(true);
                expect(this.kakitaKaezin.isHonored).toBe(false);
            });
        });
    });
});

