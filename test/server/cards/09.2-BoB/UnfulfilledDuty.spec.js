describe('Unfulfilled Duty', function() {
    integration(function() {
        describe('Unfulfilled Duty\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'border-rider', 'doji-whisperer', 'daidoji-uji', 'doji-challenger'],
                        hand: ['unfulfilled-duty']
                    },
                    player2: {
                        inPlay: ['naive-student']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.brashSamurai.bowed = true;
                this.borderRider = this.player1.findCardByName('border-rider');
                this.borderRider.fate = 1;
                this.borderRider.bowed = true;
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.daidojiUji.bowed = true;
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiChallenger.bowed = true;
                this.unfulfilledDuty = this.player1.findCardByName('unfulfilled-duty');

                this.naiveStudent = this.player2.findCardByName('naive-student');
                this.naiveStudent.bowed = true;
            });

            it('should prompt you to target bowed characters with no fate', function() {
                this.player1.clickCard(this.unfulfilledDuty);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.naiveStudent);
            });

            it('should not allow you to select zero characters', function() {
                this.player1.clickCard(this.unfulfilledDuty);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).not.toHavePromptButton('Done');
            });

            it('should not allow you to target characters greater than a total of 6 fate cost', function() {
                this.player1.clickCard(this.unfulfilledDuty);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1.player.promptState.selectedCards).toContain(this.daidojiUji);
                expect(this.player1.player.promptState.selectedCards).not.toContain(this.dojiChallenger);
            });

            it('should allow you to target characters with a total of 6 fate cost or fewer', function() {
                this.player1.clickCard(this.unfulfilledDuty);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.naiveStudent);
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should ready the chosen characters', function() {
                this.player1.clickCard(this.unfulfilledDuty);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.naiveStudent);
                this.player1.clickPrompt('Done');
                expect(this.dojiChallenger.bowed).toBe(false);
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.naiveStudent.bowed).toBe(false);
                expect(this.getChatLogs(1)).toContain('player1 plays Unfulfilled Duty to ready Doji Challenger, Brash Samurai and Naive Student');
            });
        });
    });
});
