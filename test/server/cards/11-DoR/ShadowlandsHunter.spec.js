describe('Shadowlands Hunter', function() {
    integration(function() {
        describe('Shadowlands Hunter\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shadowlands-hunter','yogo-outcast'],
                        hand: ['display-of-power']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['display-of-power']
                    }
                });
                this.yogo = this.player1.findCardByName('yogo-outcast');
                this.hunter = this.player1.findCardByName('shadowlands-hunter');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.display = this.player2.findCardByName('display-of-power');
                this.p1Display = this.player1.findCardByName('display-of-power');
                this.noMoreActions();
            });

            it('should apply unopposed even if the conflict is defended', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hunter],
                    defenders: [this.whisperer]
                });
                let honor = this.player2.honor;
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.display);
                this.player2.clickPrompt('Pass');
                expect(this.player2.honor).toBe(honor - 1);
                expect(this.getChatLogs(3)).toContain('player2 loses 1 honor for not defending the conflict');
            });

            it('should apply unopposed if the conflict is not defended', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hunter],
                    defenders: []
                });
                let honor = this.player2.honor;
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.display);
                this.player2.clickPrompt('Pass');
                expect(this.player2.honor).toBe(honor - 1);
            });

            it('should not apply unopposed if not participating is not defended', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogo],
                    defenders: [this.whisperer]
                });
                let honor = this.player2.honor;
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player2.honor).toBe(honor);
            });

            it('should not apply unopposed if it wins on defense', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    defenders: [this.hunter]
                });
                let honor = this.player1.honor;
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1.honor).toBe(honor);
            });
        });
    });
});
