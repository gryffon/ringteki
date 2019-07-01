describe('Daimyo\'s Gunbai', function() {
    integration(function() {
        describe('Daimyo\'s Gunbai\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger'],
                        hand: ['daimyo-s-gunbai', 'daimyo-s-gunbai']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        conflictDiscard: ['stay-your-hand']
                    }
                });

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.solemnScholar = this.player2.findCardByName('solemn-scholar');
                this.stayYourHand = this.player2.findCardByName('stay-your-hand');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['solemn-scholar']
                });
                this.player2.pass();
            });

            it('should prompt the player to choose a character', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                expect(this.player1).toHavePrompt('Daimyō\'s Gunbai');
                expect(this.player1).toBeAbleToSelect('doji-challenger');
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
            });

            it('should prompt the opponent to choose a character', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player2).toHavePrompt('Daimyō\'s Gunbai');
                expect(this.player2).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).toBeAbleToSelect(this.solemnScholar);
            });

            it('should initate a duel between the characters, and attach Gunbai to the winner when you win', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.daimyosGunbai.location).toBe('play area');
                expect(this.dojiChallenger.attachments.toArray()).toContain(this.daimyosGunbai);
                expect(this.daimyosGunbai.controller).toBe(this.player1.player);
            });

            it('should initate a duel between the characters, and attach Gunbai to the winner when the opponent wins', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.daimyosGunbai.location).toBe('play area');
                expect(this.solemnScholar.attachments.toArray()).toContain(this.daimyosGunbai);
                expect(this.daimyosGunbai.controller).toBe(this.player1.player);
            });

            it('should discard Gunbai if the duel is a draw', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.daimyosGunbai.location).toBe('conflict discard pile');
                expect(this.getChatLogs(3)).toContain('player1 discards Daimyō\'s Gunbai');
            });

            it('should discard Gunbai if there is already one in play from the same controller', function() {
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                this.player2.pass();
                this.daimyosGunbai2 = this.player1.clickCard('daimyo-s-gunbai', 'hand');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.daimyosGunbai2.location).toBe('conflict discard pile');
            });

            it('should discard Gunbai if the duel is cancelled', function() {
                this.player2.moveCard(this.stayYourHand, 'hand');
                this.daimyosGunbai = this.player1.clickCard('daimyo-s-gunbai');
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.solemnScholar);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.stayYourHand);
                this.player2.clickCard(this.stayYourHand);
                expect(this.daimyosGunbai.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
