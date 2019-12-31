describe('Jurojin\'s Curse', function() {
    integration(function() {
        describe('Jurojin\' Curse\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        hand: ['seeker-of-knowledge', 'jurojin-s-curse', 'jurojin-s-curse', 'against-the-waves']
                    },
                    player2: {
                        fate: 2,
                        inPlay: ['isawa-kaede'],
                        hand: ['against-the-waves', 'jurojin-s-curse']
                    }
                });
                this.seekerOfKnowledge = this.player1.playCharacterFromHand('seeker-of-knowledge', 1);
                this.isawaKaede = this.player2.findCardByName('isawa-kaede');
                this.player2.pass();
                this.jurojinsCurse = this.player1.playAttachment('jurojin-s-curse', this.seekerOfKnowledge);
            });

            it('should not trigger if it\'s parent is bowed at the end of the fate phase', function() {
                this.player2.pass();
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.seekerOfKnowledge);
                expect(this.seekerOfKnowledge.bowed).toBe(true);
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should resolve a second fate phase', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.getChatLogs(3)).toContain('player1 uses Jurōjin\'s Curse to resolve a second fate phase after this');
                expect(this.getChatLogs(2)).toContain('Jurōjin\'s Curse takes hold!');
                this.player2.clickPrompt('Done');
                expect(this.seekerOfKnowledge.fate).toBe(0);
                expect(this.isawaKaede.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.game.rings.air.fate).toBe(2);
            });

            it('should not allow two triggers in the same round', function() {
                this.player2.pass();
                this.curse2 = this.player1.playAttachment('jurojin-s-curse', this.seekerOfKnowledge);
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.seekerOfKnowledge.location).toBe('play area');
                expect(this.isawaKaede.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.game.rings.air.fate).toBe(2);
                this.noMoreActions();
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('End Round');
                this.player2.clickPrompt('End Round');

                expect(this.game.currentPhase).toBe('dynasty');
            });

            it('should allow two triggers from both players', function() {
                this.curse2 = this.player2.playAttachment('jurojin-s-curse', this.isawaKaede);
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.seekerOfKnowledge.fate).toBe(0);
                expect(this.isawaKaede.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.game.rings.air.fate).toBe(2);

                this.noMoreActions();
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                expect(this.seekerOfKnowledge.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.game.rings.air.fate).toBe(3);
            });
        });
    });
});
