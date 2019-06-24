describe('Asako Diplomat', function () {
    integration(function () {
        describe('Asako Diplomat\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-diplomat', 'shiba-tsukune']
                    },
                    player2: {
                        inPlay: ['daidoji-uji', 'marauding-oni']
                    }
                });
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.daidojiUji = this.player2.findCardByName('daidoji-uji');
                this.maraudingOni = this.player2.findCardByName('marauding-oni');
                this.noMoreActions();
            });

            it('should trigger and honor a character after winning a conflict', function () {
                this.initiateConflict({
                    attackers: [this.asakoDiplomat],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asakoDiplomat);
                this.player1.clickCard(this.asakoDiplomat);
                expect(this.player1).toBeAbleToSelect(this.asakoDiplomat);
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).not.toBeAbleToSelect(this.maraudingOni);
                this.player1.clickCard(this.shibaTsukune);
                expect(this.player1).toHavePrompt('Select an action:');
                this.player1.clickPrompt('Honor this character');
                expect(this.shibaTsukune.isHonored).toBe(true);
            });

            it('should trigger and dishonor a character after winning a conflict', function () {
                this.initiateConflict({
                    attackers: [this.asakoDiplomat],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.asakoDiplomat);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickPrompt('Dishonor this character');
                expect(this.daidojiUji.isDishonored).toBe(true);
            });

            it('should not trigger if Asako Diplomat is not participating', function () {
                this.initiateConflict({
                    attackers: [this.shibaTsukune],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger after losing the conflict', function () {
                this.initiateConflict({
                    attackers: [this.asakoDiplomat],
                    defenders: [this.daidojiUji]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
