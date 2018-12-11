describe('Jewel of the Khamasin', function() {
    integration(function() {
        describe('Jewel of the Khamasin\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth','shinjo-scout'],
                        hand: ['jewel-of-the-khamasin']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.shinjoScout = this.player1.findCardByName('shinjo-scout');
                this.jewelOfTheKhamasin = this.player1.playAttachment('jewel-of-the-khamasin', this.motoYouth);

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

                this.player2.pass();
            });

            it('should not trigger when the attached character is not attacking', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.jewelOfTheKhamasin);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.pass();
                this.initiateConflict({
                    attackers: [this.shinjoScout],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.jewelOfTheKhamasin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.pass();
                this.player1.clickPrompt('Don\'t Resolve');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.motoYouth],
                    ring: 'earth'
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.jewelOfTheKhamasin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict when attached character is attacking', function() {
                beforeEach(function() {
                    this.player1.pass();
                    this.initiateConflict({
                        attackers: [this.motoYouth],
                        defenders: []
                    });
                });

                it('should cost 1 honor', function() {
                    let honor = this.player1.player.honor;
                    this.player2.pass();
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.player1.player.honor).toBe(honor - 1);
                });

                it('if it resolves should reduce the attacked province by 1 strength', function() {
                    let provinceStrength = this.game.currentConflict.conflictProvince.getStrength();
                    this.player2.pass();
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(provinceStrength - 1);
                });

                it('it should be able to be resolved unlimited times (until province strength is zero)', function() {
                    let provinceStrength = this.game.currentConflict.conflictProvince.getStrength();
                    let honor = this.player1.player.honor;
                    this.player2.pass();
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.player1.player.honor).toBe(honor - 1);
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(provinceStrength - 1);
                    this.player2.pass();
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.player1.player.honor).toBe(honor - 2);
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(provinceStrength - 2);
                    this.player2.pass();
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.player1.player.honor).toBe(honor - 3);
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(provinceStrength - 3);
                    this.player2.pass();
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(0);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.jewelOfTheKhamasin);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
