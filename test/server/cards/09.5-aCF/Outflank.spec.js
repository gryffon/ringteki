describe('Outflank', function() {
    integration(function() {
        describe('Outflank\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth'],
                        hand: ['outflank', 'chasing-the-sun']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'doji-kuwanan', 'tengu-sensei'],
                        hand: ['finger-of-jade']
                    }
                });

                this.outflank = this.player1.findCardByName('outflank');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.tengu = this.player2.findCardByName('tengu-sensei');
                this.foj = this.player2.findCardByName('finger-of-jade');
                this.chasingTheSun = this.player1.findCardByName('chasing-the-sun');
                this.shameful1 = this.player2.provinces['province 1'].provinceCard;
                this.shameful2 = this.player2.provinces['province 2'].provinceCard;
                this.shameful3 = this.player2.provinces['province 3'].provinceCard;
            });

            it('should trigger when a province is revealed', function() {
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
            });

            it('should not trigger when a province is already revealed', function() {
                this.shameful1.facedown = false;
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.outflank);
            });

            it('should not trigger when a province is revealed mid-conflict', function() {
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickPrompt('Pass');
                this.player2.assignDefenders([]);
                this.player2.pass();
                this.player1.clickCard(this.chasingTheSun);
                this.player1.clickCard(this.shameful2);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should allow you to select opponent\'s non-unique characters', function() {
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                expect(this.player1).not.toBeAbleToSelect(this.dojiKuwanan);
            });

            it('should not allow the selected character to declare as a defender', function() {
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);

                this.player2.assignDefenders([this.dojiKuwanan, this.dojiChallenger, this.tengu]);
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).not.toContain(this.tengu);
            });

            it('should expire at the end of the conflict', function() {
                this.noMoreActions();
                this.player1.declareConflict('military', this.shameful1, [this.motoYouth], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);
                this.player2.assignDefenders([]);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                this.tengu.bowed = true;
                this.dojiKuwanan.bowed = true;
                this.dojiChallenger.bowed = true;
                this.noMoreActions();

                this.motoYouth.bowed = false;
                this.tengu.bowed = false;
                this.dojiKuwanan.bowed = false;
                this.dojiChallenger.bowed = false;
                
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    province: this.shameful2,
                    attackers: [this.motoYouth],
                    defenders: [this.dojiChallenger, this.dojiKuwanan, this.tengu]
                });
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).toContain(this.tengu);
            });
        });
    });
});

