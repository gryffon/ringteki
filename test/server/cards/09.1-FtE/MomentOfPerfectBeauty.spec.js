describe('MomentOfPerfectBeauty', function() {
    integration(function() {
        describe('Moment of Perfect Beauty\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['moment-of-perfect-beauty']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves', 'miya-mystic', 'tattooed-wanderer'],
                        hand: ['fine-katana', 'hawk-tattoo']
                    }
                });

                this.momentofbeauty = this.player1.findCardByName('moment-of-perfect-beauty');
                this.dojichallenger = this.player1.findCardByName('doji-challenger');
                this.finekatana = this.player2.findCardByName('fine-katana');
                this.hawktattoo = this.player2.findCardByName('hawk-tattoo');
                this.noMoreActions();
            });

            it('should not play outside of conflict', function() {
                this.player1.clickCard(this.momentofbeauty);
                expect(this.momentofbeauty.location).toBe('hand');
            });

            it('should not play unless controlling more participating honored characters', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.momentofbeauty);
                expect(this.momentofbeauty.location).toBe('hand');
            });

            it('should play with the right conditions', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.dojichallenger.honor();
                this.player2.pass();
                this.player1.clickCard(this.momentofbeauty);
                expect(this.momentofbeauty.location).toBe('conflict discard pile');
            });

            it('should end conflict if other player passes', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.dojichallenger.honor();
                this.player2.pass();
                this.player1.clickCard(this.momentofbeauty);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Break Shameful Display');
            });

            it('should end conflict if other player plays a card', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.dojichallenger.honor();
                this.player2.pass();
                this.player1.clickCard(this.momentofbeauty);
                this.player2.playAttachment('fine-katana', 'adept-of-the-waves');
                expect(this.player1).toHavePrompt('Break Shameful Display');
            });

            // Latest ruling states that conflict ends only after all actions from Hawk Tattoo, etc. are taken
            it('should Not end conflict until other player loses action priority', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.dojichallenger.honor();
                this.player2.pass();
                this.player1.clickCard(this.momentofbeauty);
                this.player2.playAttachment('hawk-tattoo', 'tattooed-wanderer');
                this.player2.clickCard(this.hawktattoo);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Waiting for opponent to use Air Ring');
                expect(this.player1).toHavePrompt('Choose an effect to resolve');
            });
        });
    });
});
