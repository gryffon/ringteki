describe('Persuasive Counselor', function() {
    integration(function() {
        describe('Persuasive Counselor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-tadaka-2', 'doji-whisperer', 'shiba-yojimbo'],
                        hand: ['voice-of-honor', 'finger-of-jade', 'yogo-kikuyo'],
                        conflictDiscard: ['defend-your-honor']
                    },
                    player2: {
                        inPlay: ['persuasive-counselor', 'bayushi-shoju', 'kitsu-spiritcaller'],
                        hand: ['against-the-waves', 'way-of-the-scorpion', 'jade-tetsubo', 'mirumoto-s-fury'],
                        provinces: ['meditations-on-the-tao']
                    }
                });
                this.tadaka = this.player1.findCardByName('isawa-tadaka-2');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.yojimbo = this.player1.findCardByName('shiba-yojimbo');

                this.voice = this.player1.findCardByName('voice-of-honor');
                this.dyh = this.player1.findCardByName('defend-your-honor');
                this.finger = this.player1.findCardByName('finger-of-jade');
                this.kikuyo = this.player1.findCardByName('yogo-kikuyo');

                this.counselor = this.player2.findCardByName('persuasive-counselor');
                this.shoju = this.player2.findCardByName('bayushi-shoju');
                this.spiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
                this.atw = this.player2.findCardByName('against-the-waves');
                this.fury = this.player2.findCardByName('mirumoto-s-fury');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
                this.tetsubo = this.player2.findCardByName('jade-tetsubo');

                this.tadaka.fate = 5;
                this.whisperer.fate = 1;
                this.yojimbo.honor();
                this.player1.playAttachment(this.finger, this.whisperer);
                this.player2.playAttachment(this.tetsubo, this.counselor);
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.tadaka, this.whisperer, this.yojimbo],
                    defenders: [this.counselor, this.shoju]
                });
            });

            it('events should cancel as normal', function() {
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                expect(this.player1).not.toBeAbleToSelect(this.finger);

                this.player1.clickCard(this.yojimbo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.bowed).toBe(false);
            });

            it('effect should stop events from being cancelled', function() {
                this.player2.clickCard(this.counselor);
                expect(this.getChatLogs(3)).toContain('player2 uses Persuasive Counselor to prevent their events from being cancelled this conflict');
                this.player1.pass();
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.bowed).toBe(true);
            });

            it('effect should stop events from being cancelled (FoJ)', function() {
                this.player2.clickCard(this.counselor);
                expect(this.getChatLogs(3)).toContain('player2 uses Persuasive Counselor to prevent their events from being cancelled this conflict');
                this.player1.pass();
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.whisperer);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.whisperer.isDishonored).toBe(true);
            });

            it('effect should allow DYH to be played, but it wont cancel the event', function() {
                this.player1.moveCard(this.dyh, 'hand');
                this.player2.clickCard(this.counselor);
                expect(this.getChatLogs(3)).toContain('player2 uses Persuasive Counselor to prevent their events from being cancelled this conflict');
                this.player1.pass();
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dyh);
                this.player1.clickCard(this.dyh);
                this.player1.clickCard(this.tadaka);
                this.player2.clickCard(this.shoju);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.bowed).toBe(true);
                expect(this.getChatLogs(3)).toContain('The duel has no effect');
            });

            it('effect should allow DYH to be played, but it wont cancel the event', function() {
                this.player1.moveCard(this.dyh, 'hand');
                this.player2.clickCard(this.counselor);
                expect(this.getChatLogs(3)).toContain('player2 uses Persuasive Counselor to prevent their events from being cancelled this conflict');
                this.player1.pass();
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dyh);
                this.player1.clickCard(this.dyh);
                this.player1.clickCard(this.tadaka);
                this.player2.clickCard(this.counselor);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.bowed).toBe(true);
                expect(this.getChatLogs(3)).toContain('The duel has no effect');
            });

            it('character abilities should cancel as normal', function() {
                let pol = this.tadaka.getPoliticalSkill();
                this.player2.clickCard(this.counselor);
                this.player1.pass();
                this.player2.clickCard(this.shoju);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.getPoliticalSkill()).toBe(pol);
            });

            it('character abilities should cancel as normal', function() {
                let pol = this.whisperer.getPoliticalSkill();
                this.player2.clickCard(this.counselor);
                this.player1.pass();
                this.player2.clickCard(this.shoju);
                this.player2.clickCard(this.whisperer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.finger);
                this.player1.clickCard(this.finger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.whisperer.getPoliticalSkill()).toBe(pol);
            });

            it('attachment abilities should cancel as normal', function() {
                let fate = this.tadaka.fate;
                this.player2.clickCard(this.counselor);
                this.player1.pass();
                this.player2.clickCard(this.tetsubo);
                this.player2.clickCard(this.tadaka);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yojimbo);
                this.player1.clickCard(this.yojimbo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.tadaka.fate).toBe(fate);
            });

            it('attachment abilities should cancel as normal', function() {
                let fate = this.whisperer.fate;
                this.player2.clickCard(this.counselor);
                this.player1.pass();
                this.player2.clickCard(this.tetsubo);
                this.player2.clickCard(this.whisperer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.finger);
                this.player1.clickCard(this.finger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.whisperer.fate).toBe(fate);
            });
        });
    });
});
