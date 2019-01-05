describe('Formal Invitation', function() {
    integration(function() {
        describe('', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['formal-invitation']
                    },
                    player2: {
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.formalInvitation = this.player1.findCardByName('formal-invitation');
            });

            describe('Formal Invitation', function() {
                it('should not attach to a character with 1 glory', function() {
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.player1).toHavePrompt('Formal Invitation');
                    expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                    this.player1.clickCard(this.dojiWhisperer);
                    expect(this.player1).toHavePrompt('Formal Invitation');
                });

                it('should attach to a character with 2 glory', function() {
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.player1).toHavePrompt('Formal Invitation');
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    this.player1.clickCard(this.dojiChallenger);
                    expect(this.formalInvitation.parent).toBe(this.dojiChallenger);
                });

                it('should give +1 political skill to attached character', function() {
                    let politicalSkill = this.dojiChallenger.getPoliticalSkill();
                    this.player1.clickCard(this.formalInvitation);
                    this.player1.clickCard(this.dojiChallenger);
                    expect(this.dojiChallenger.getPoliticalSkill()).toBe(politicalSkill + 1);
                });
            });

            describe('Formal Invitation\'s triggered ability', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.formalInvitation);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player2.pass();
                });

                it('should not trigger outside a political conflict', function() {
                    expect(this.player1).toHavePrompt('Action Window');
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.player1).toHavePrompt('Action Window');
                    this.player1.pass();
                    this.initiateConflict({
                        attackers: [this.dojiWhisperer],
                        defenders: []
                    });
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not trigger if attached character already participating', function() {
                    this.player1.pass();
                    this.initiateConflict({
                        attackers: [this.dojiChallenger],
                        defenders: [],
                        type: 'political'
                    });
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should move attached character to the conflict', function() {
                    this.player1.pass();
                    this.initiateConflict({
                        attackers: [this.dojiWhisperer],
                        defenders: [],
                        type: 'political'
                    });
                    this.player2.pass();
                    expect(this.dojiChallenger.inConflict).toBe(false);
                    this.player1.clickCard(this.formalInvitation);
                    expect(this.dojiChallenger.inConflict).toBe(true);
                });
            });
        });
    });
});
