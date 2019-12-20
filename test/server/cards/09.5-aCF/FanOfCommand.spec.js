describe('Fan of Command', function() {
    integration(function() {
        describe('Fan of Command', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'doji-whisperer', 'doji-kuwanan'],
                        hand: ['a-new-name', 'fan-of-command']
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.challenger = this.player1.findCardByName('doji-challenger');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.newName = this.player1.findCardByName('a-new-name');
                this.fan = this.player1.findCardByName('fan-of-command');

                this.player1.playAttachment(this.fan, this.challenger);
            });

            it('should be usable if holder is participating and a bowed bushi is in the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.kuwanan, this.whisperer],
                    defenders: []
                });
                this.challenger.bowed = true;
                this.kuwanan.bowed = true;
                this.whisperer.bowed = true;

                this.player2.pass();
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            });

            it('should not be usable if no bowed bushi are participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.kuwanan, this.whisperer],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should ready the target', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.kuwanan, this.whisperer],
                    defenders: []
                });
                this.challenger.bowed = true;
                this.kuwanan.bowed = true;
                this.whisperer.bowed = true;

                this.player2.pass();
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
                this.player1.clickCard(this.kuwanan);
                expect(this.getChatLogs(3)).toContain('player1 uses Fan of Command to ready Doji Kuwanan');
                expect(this.kuwanan.bowed).toBe(false);
            });

            it('should not be usable outside of a conflict', function() {
                this.player2.pass();
                this.challenger.bowed = true;
                this.kuwanan.bowed = true;
                this.whisperer.bowed = true;

                expect(this.player1).not.toBeAbleToSelect(this.fan);
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be usable if holder is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan, this.whisperer],
                    defenders: []
                });
                this.challenger.bowed = true;
                this.kuwanan.bowed = true;
                this.whisperer.bowed = true;

                this.player2.pass();
                expect(this.player1).not.toBeAbleToSelect(this.fan);
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be usable if the target has gained bushi', function() {
                this.player2.pass();
                this.player1.playAttachment(this.newName, this.whisperer);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.kuwanan, this.whisperer],
                    defenders: []
                });
                this.challenger.bowed = true;
                this.kuwanan.bowed = true;
                this.whisperer.bowed = true;

                this.player2.pass();
                this.player1.clickCard(this.fan);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
            });
        });
    });
});
