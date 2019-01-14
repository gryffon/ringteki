describe('Honed Nodachi', function() {
    integration(function () {
        describe('Honed Nodachi', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrewd-yasuki','intimidating-hida'],
                        hand: ['honed-nodachi']
                    },
                    player2: {
                        inPlay: ['student-of-war']
                    }
                });
                this.hida = this.player1.findCardByName('intimidating-hida');
                this.nodachi = this.player1.findCardByName('honed-nodachi');
                this.yasuki = this.player1.findCardByName('shrewd-yasuki');

                this.student = this.player2.findCardByName('student-of-war');
            });

            it('should only be able to be attached to a bushi character', function () {
                this.player1.clickCard(this.nodachi);
                expect(this.player1).toBeAbleToSelect(this.hida);
                expect(this.player1).toBeAbleToSelect(this.student);
                expect(this.player1).not.toBeAbleToSelect(this.yasuki);
                this.player1.clickPrompt('Cancel');
            });
        });

        describe('During military conflicts', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['intimidating-hida','shrewd-yasuki'],
                        hand: ['honed-nodachi','assassination']
                    },
                    player2: {
                        inPlay: ['student-of-war','eager-scout'],
                        hand: ['game-of-sadane']
                    }
                });
                this.hida = this.player1.findCardByName('intimidating-hida');
                this.nodachi = this.player1.findCardByName('honed-nodachi');
                this.yasuki = this.player1.findCardByName('shrewd-yasuki');

                this.student = this.player2.findCardByName('student-of-war');
                this.scout = this.player2.findCardByName('eager-scout');
                this.sadane = this.player2.findCardByName('game-of-sadane');

                this.player1.clickCard(this.nodachi);
                this.player1.clickCard(this.hida);
                this.noMoreActions();
                this.player1.player.showBid = 3;
                this.player2.player.showBid = 5;
                this.hida.fate = 1;
                this.initiateConflict({
                    type: 'military',
                    attackers: ['intimidating-hida'],
                    defenders: ['student-of-war','eager-scout']
                });
                this.player2.pass();
            });

            it('should trigger after winning a military conflict', function() {
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.nodachi);
            });

            it('should correctly force opponent to discard', function() {
                this.player1.pass();
                this.player1.clickCard(this.nodachi);
                expect(this.player2).toHavePrompt('Choose a character to discard');
            });

            it('should target legal characters', function() {
                this.player1.pass();
                this.player1.clickCard(this.nodachi);
                expect(this.player2).toBeAbleToSelect(this.student);
                expect(this.player2).toBeAbleToSelect(this.scout);
                expect(this.player2).not.toBeAbleToSelect(this.yasuki);
            });

            it('should correctly discard characters', function() {
                this.player1.pass();
                this.player1.clickCard(this.nodachi);
                this.player2.clickCard(this.student);
                expect(this.student.location).toBe('dynasty discard pile');
            });

            it('should correctly remove fate from attached character', function() {
                this.player1.pass();
                this.player1.clickCard(this.nodachi);
                this.player2.clickCard(this.student);
                expect(this.hida.fate).toBe(0);
            });

            it('should not trigger if attached character has no fate', function() {
                this.hida.fate = 0;
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if there are no legal targets', function() {
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.scout);
                this.player2.clickCard(this.sadane);
                this.player2.clickCard(this.student);
                this.player2.clickCard(this.hida);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
