describe('Hida Sugi', function() {
    integration(function() {
        describe('Hida Sugi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-sugi', 'guardian-kami'],
                        dynastyDiscard: ['borderlands-defender']
                    },
                    player2: {
                        inPlay: ['akodo-gunso', 'wandering-ronin'],
                        dynastyDiscard: ['favorable-ground']
                    }
                });

                this.hidaSugi = this.player1.findCardByName('hida-sugi');
                this.guardianKami = this.player1.findCardByName('guardian-kami');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.favorableGround = this.player2.findCardByName('favorable-ground');
            });

            it('should not trigger if you do not win the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaSugi],
                    defenders: [this.akodoGunso, this.wanderingRonin]
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if Hida Sugi is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should trigger when you win a conflict with Hida Sugi participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaSugi],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaSugi);
            });

            it('should prompt you to choose a card in either dynasty discard pile', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaSugi],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickCard(this.hidaSugi);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player1).toBeAbleToSelect(this.favorableGround);
            });

            it('should put that card on the bottom of the owner\'s dynasty deck', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaSugi],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickCard(this.hidaSugi);
                this.player1.clickCard(this.favorableGround);
                expect(this.favorableGround.location).toBe('dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 uses Hida Sugi to move Favorable Ground to bottom of player2\'s dynasty deck');
                expect(this.player2.player.dynastyDeck.last()).toBe(this.favorableGround);
            });
        });
    });
});

