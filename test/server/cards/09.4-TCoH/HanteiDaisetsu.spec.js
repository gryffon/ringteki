describe('Hantei Daisetsu', function() {
    integration(function() {
        describe('Hantei Daisetsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hantei-daisetsu', 'callow-delegate']
                    },
                    player2: {
                        inPlay: ['shrine-maiden', 'henshin-disciple']
                    }
                });

                this.hanteiDaisetsu = this.player1.findCardByName('hantei-daisetsu');
                this.callowDelegate = this.player1.findCardByName('callow-delegate');

                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.henshinDisciple = this.player2.findCardByName('henshin-disciple');

                this.noMoreActions();
            });

            it('should blank a participating character during a political conflict.', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.hanteiDaisetsu, this.callowDelegate],
                    defenders: [this.henshinDisciple]
                });

                this.player2.pass();
                this.player1.clickCard(this.hanteiDaisetsu);
                this.player1.clickCard(this.henshinDisciple);

                expect(this.getChatLogs(10)).toContain('player1 uses Hantei Daisetsu to treat Henshin Disciple as if its text box were blank until the end of the conflict');
                expect(this.henshinDisciple.isBlank()).toBe(true);
            });

            it('only last until the end of the conflict.', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.hanteiDaisetsu, this.callowDelegate],
                    defenders: [this.henshinDisciple]
                });

                this.player2.pass();
                this.player1.clickCard(this.hanteiDaisetsu);
                this.player1.clickCard(this.henshinDisciple);

                expect(this.henshinDisciple.isBlank()).toBe(true);

                this.noMoreActions();
                this.player1.clickPrompt('no');
                this.player1.clickPrompt('don\'t resolve');
                expect(this.player1).toHavePrompt('action window');
                expect(this.henshinDisciple.isBlank()).toBe(false);
            });

            it('should not be able to be triggered in a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hanteiDaisetsu, this.callowDelegate],
                    defenders: [this.henshinDisciple]
                });

                this.player2.pass();
                this.player1.clickCard(this.hanteiDaisetsu);
                this.player1.clickCard(this.henshinDisciple);

                expect(this.henshinDisciple.isBlank()).toBe(false);
                expect(this.player1).toHavePrompt('conflict action window');
            });

            it('should not be able to be triggered on non-participating characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.hanteiDaisetsu, this.callowDelegate],
                    defenders: [this.henshinDisciple]
                });

                this.player2.pass();
                this.player1.clickCard(this.hanteiDaisetsu);
                this.player1.clickCard(this.shrineMaiden);

                expect(this.player1).not.toBeAbleToSelect(this.shrineMaiden);
                expect(this.shrineMaiden.isBlank()).toBe(false);
            });

            it('should not be able to be triggered when Daisetsu isn\'t participating', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.callowDelegate],
                    defenders: [this.henshinDisciple]
                });

                this.player2.pass();
                this.player1.clickCard(this.hanteiDaisetsu);
                this.player1.clickCard(this.shrineMaiden);

                expect(this.player1).not.toBeAbleToSelect(this.shrineMaiden);
                expect(this.shrineMaiden.isBlank()).toBe(false);
            });
        });
    });
});
