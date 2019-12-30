describe('Shukujo', function() {
    integration(function() {
        describe('Shukujo attachment', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['doji-kuwanan', 'brash-samurai', 'kakita-toshimoko', 'yoritomo'],
                        hand: ['shukujo', 'seal-of-the-crane']
                    },
                    player2: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['let-go']
                    }
                });
                this.dojiKuwananP1 = this.player1.findCardByName('doji-kuwanan');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.kakitaToshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.yoritomo = this.player1.findCardByName('yoritomo');
                this.shukujo = this.player1.findCardByName('shukujo');
                this.sealOfTheCrane = this.player1.findCardByName('seal-of-the-crane');

                this.dojiKuwananP2 = this.player2.findCardByName('doji-kuwanan');
                this.letGo = this.player2.findCardByName('let-go');
            });

            it('should only be able to attach to unique crane characters you control', function() {
                this.player1.clickCard(this.shukujo);
                expect(this.player1).toBeAbleToSelect(this.dojiKuwananP1);
                expect(this.player1).not.toBeAbleToSelect(this.dojiKuwananP2);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.yoritomo);
            });

            it('should grant the ability to a character that is a crane champion when attached', function() {
                let dojiKuwananActionCount = this.dojiKuwananP1.getActions().length;
                this.player1.playAttachment(this.shukujo, this.dojiKuwananP1);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.dojiKuwananP1.getActions().length).toBe(dojiKuwananActionCount + 1);
            });

            it('should not grant an ability to a character that is not a champion when attached', function() {
                let toshimokoActionCount = this.kakitaToshimoko.getActions().length;
                this.player1.playAttachment(this.shukujo, this.kakitaToshimoko);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.kakitaToshimoko.getActions().length).toBe(toshimokoActionCount);
            });

            describe('unique non-crane character with the seal of the crane attached', function() {
                beforeEach(function () {
                    this.player1.playAttachment(this.sealOfTheCrane, this.yoritomo);
                    this.player2.pass();
                });

                it('should attach', function() {
                    this.player1.clickCard(this.shukujo);
                    expect(this.player1).toBeAbleToSelect(this.yoritomo);
                });

                it('should grant the ability if the character is a champion', function() {
                    let yoritomoActionCount = this.yoritomo.getActions().length;
                    this.player1.playAttachment(this.shukujo, this.yoritomo);
                    expect(this.yoritomo.getActions().length).toBe(yoritomoActionCount + 1);
                });

                it('should discard if the character loses crane', function() {
                    this.player1.playAttachment(this.shukujo, this.yoritomo);
                    this.player2.clickCard(this.letGo);
                    this.player2.clickCard(this.sealOfTheCrane);
                    expect(this.shukujo.location).toBe('conflict discard pile');
                });
            });

            describe('ability', function () {
                beforeEach(function () {
                    this.player1.playAttachment(this.shukujo, this.dojiKuwananP1);
                    this.noMoreActions();
                });

                it('ability should not be on shukujo itself', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.dojiKuwananP1],
                        defenders: [this.dojiKuwananP2]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.shukujo);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    expect(this.game.currentConflict.conflictType).toBe('military');
                });

                it('should switch the conflict type from military to political', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.dojiKuwananP1],
                        defenders: [this.dojiKuwananP2]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.dojiKuwananP1);
                    expect(this.player1).toHavePromptButton('Switch the conflict type');
                    this.player1.clickPrompt('Switch the conflict type');
                    expect(this.game.currentConflict.conflictType).toBe('political');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.getChatLogs(3)).toContain('player1 uses Doji Kuwanan\'s gained ability from Shukujo to switch the conflict type');
                });

                it('should switch the conflict type from political to military', function() {
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.dojiKuwananP1],
                        defenders: [this.dojiKuwananP2]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.dojiKuwananP1);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.game.currentConflict.conflictType).toBe('military');
                });

                it('should not trigger action if champion it is attached to is not participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kakitaToshimoko],
                        defenders: [this.dojiKuwananP2]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.dojiKuwananP1);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    expect(this.game.currentConflict.conflictType).toBe('military');
                });
            });
        });
    });
});
