describe('Outflank', function() {
    integration(function() {
        describe('Outflank\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth'],
                        hand: ['outflank', 'chasing-the-sun'],
                        conflictDiscard: ['outflank'],
                        provinces: ['border-fortress']
                    },
                    player2: {
                        provinces: ['shameful-display', 'shameful-display', 'toshi-ranbo'],
                        inPlay: ['doji-challenger', 'doji-kuwanan', 'tengu-sensei'],
                        hand: ['finger-of-jade']
                    }
                });

                this.outflank = this.player1.findCardByName('outflank', 'hand');
                this.outflank2 = this.player1.findCardByName('outflank', 'conflict discard pile');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.tengu = this.player2.findCardByName('tengu-sensei');
                this.foj = this.player2.findCardByName('finger-of-jade');
                this.chasingTheSun = this.player1.findCardByName('chasing-the-sun');

                this.borderFortress = this.player1.findCardByName('border-fortress', 'province 1');
                this.shameful1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shameful2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.toshiRanbo = this.player2.findCardByName('toshi-ranbo', 'province 3');
            });

            it('should trigger when a province is revealed', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
            });

            it('should not trigger when a province is already revealed', function() {
                expect(this.toshiRanbo.facedown).toBe(false);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.toshiRanbo
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose Defenders');
            });

            it('should trigger when a province is revealed mid-conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickPrompt('Pass');
                this.player2.assignDefenders([]);
                this.player2.pass();
                this.player1.clickCard(this.chasingTheSun);
                this.player1.clickCard(this.shameful2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
            });

            it('should allow you to select any non-unique character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                expect(this.player1).not.toBeAbleToSelect(this.dojiKuwanan);
            });

            it('should not allow the selected character to declare as a defender', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);
                expect(this.getChatLogs(2)).toContain('player1 plays Outflank to prevent Tengu Sensei from declaring as a defender this conflict');

                this.player2.assignDefenders([this.dojiKuwanan, this.dojiChallenger, this.tengu]);
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).not.toContain(this.tengu);
            });

            it('should not allow you to play the card twice', function() {
                this.player1.moveCard(this.outflank2, 'hand');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.outflank2);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.outflank2);
            });

            it('should expire at the end of the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);
                this.player2.assignDefenders([this.dojiKuwanan, this.dojiChallenger, this.tengu]);
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).not.toContain(this.tengu);
                this.player2.pass();
                this.player1.pass();
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

            it('should trigger when you reveal an opponent\'s province as the defender', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickPrompt('Pass');
                this.player2.assignDefenders([this.dojiKuwanan, this.dojiChallenger, this.tengu]);
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).toContain(this.tengu);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.tengu.bowed = false;
                this.dojiKuwanan.bowed = false;
                this.dojiChallenger.bowed = false;
                this.motoYouth.bowed = false;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    province: this.borderFortress,
                    attackers: [this.dojiChallenger, this.dojiKuwanan],
                    defenders: [this.motoYouth]
                });
                expect(this.borderFortress.facedown).toBe(false);
                expect(this.shameful2.facedown).toBe(true);
                this.player1.clickCard(this.borderFortress);
                expect(this.player1).toBeAbleToSelect(this.shameful2);
                this.player1.clickCard(this.shameful2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
            });

            it('should be able to be cancelled via finger of jade', function() {
                this.player1.pass();
                this.player2.playAttachment(this.foj, this.tengu);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    province: this.shameful1
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.outflank);
                this.player1.clickCard(this.outflank);
                expect(this.player1).toBeAbleToSelect(this.tengu);
                this.player1.clickCard(this.tengu);
                expect(this.player2).toBeAbleToSelect(this.foj);
                this.player2.clickCard(this.foj);
                this.player2.assignDefenders([this.dojiKuwanan, this.dojiChallenger, this.tengu]);
                expect(this.game.currentConflict.defenders).toContain(this.dojiKuwanan);
                expect(this.game.currentConflict.defenders).toContain(this.dojiChallenger);
                expect(this.game.currentConflict.defenders).toContain(this.tengu);
            });
        });
    });
});

