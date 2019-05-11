describe('Hantei Sotorii', function() {
    integration(function() {
        describe('Hantei Sotorii\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hantei-sotorii']
                    },
                    player2: {
                        inPlay: ['akodo-toturi','hantei-sotorii'],
                        provinces: ['kuroi-mori']
                    }
                });
                this.hanteiSotoriiP1 = this.player1.findCardByName('hantei-sotorii');
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.hanteiSotoriiP2 = this.player2.findCardByName('hantei-sotorii');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hanteiSotoriiP1],
                    defenders: [this.toturi]
                });
            });

            it('should not work if he is not participating', function() {
                this.player2.clickCard(this.hanteiSotoriiP2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work if he is participating', function() {
                this.player2.pass();
                this.player1.clickCard(this.hanteiSotoriiP1);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should only target participating characters', function() {
                this.player2.pass();
                this.player1.clickCard(this.hanteiSotoriiP1);
                expect(this.player1).toBeAbleToSelect(this.hanteiSotoriiP1);
                expect(this.player1).toBeAbleToSelect(this.toturi);
                expect(this.player1).not.toBeAbleToSelect(this.hanteiSotoriiP2);
            });

            it('should not work during political conflicts', function() {
                this.player2.clickCard(this.kuroiMori);
                this.player2.clickPrompt('Switch the conflict type');
                this.player1.clickCard(this.hanteiSotoriiP1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should give the chosen character +3 glory', function() {
                this.player2.pass();
                this.player1.clickCard(this.hanteiSotoriiP1);
                this.player1.clickCard(this.toturi);
                expect(this.toturi.glory).toBe(6);
            });

            it('should only work until the end of the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.hanteiSotoriiP1);
                this.player1.clickCard(this.toturi);
                this.noMoreActions();
                this.player2.clickPrompt('Pass');
                expect(this.toturi.glory).toBe(3);
            });
        });
    });
});
