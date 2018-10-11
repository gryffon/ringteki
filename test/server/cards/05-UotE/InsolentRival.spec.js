describe('Insolent Rival', function() {
    integration(function() {
        describe('Insolent Rival\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['insolent-rival','bayushi-manipulator']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.rival = this.player1.findCardByName('insolent-rival');
                this.doji = this.player2.findCardByName('doji-whisperer');
            });

            it('should get +2 to both skills if honor bid is higher', function() {
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 1;
                expect(this.rival.militarySkill).toBe(4);
                expect(this.rival.politicalSkill).toBe(3);
            });

            it('should not get +2 to both skills if honor bid is lower', function() {
                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;
                expect(this.rival.militarySkill).toBe(2);
                expect(this.rival.politicalSkill).toBe(1);
            });

            it('should not trigger if he is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['bayushi-manipulator'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.rival);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if there is no defender', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rival],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.rival);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger if he is participating and opponent char too', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rival],
                    defenders: ['doji-whisperer']
                });
                this.player2.pass();
                this.player1.clickCard(this.rival);
                expect(this.player1).toHavePrompt('Insolent Rival');
            });

            it('should dishonor the loser of the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rival],
                    defenders: ['doji-whisperer']
                });
                this.player2.pass();
                this.player1.clickCard(this.rival);
                expect(this.player1).toBeAbleToSelect('doji-whisperer');
                this.player1.clickCard('doji-whisperer');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.doji.isDishonored).toBe(true);
            });
        });
    });
});
