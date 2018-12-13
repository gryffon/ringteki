describe('Karmic Twist', function() {
    integration(function() {
        describe('Karmic Twist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'asako-diplomat', 'asako-tsuki'],
                        hand: ['karmic-twist', 'embrace-the-void']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator', 'bayushi-shoju', 'soshi-illusionist']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');
                this.asakoDiplomat.fate = 2;
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.asakoTsuki.fate = 1;

                this.karmicTwist = this.player1.findCardByName('karmic-twist');
                this.embraceTheVoid = this.player1.findCardByName('embrace-the-void');

                this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                this.bayushiManipulator.fate = 1;
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.soshiIllusionist = this.player2.findCardByName('soshi-illusionist');
            });

            it('should prompt to choose a non-unique character with 1 or more fate as the donor', function() {
                this.player1.clickCard(this.karmicTwist);
                expect(this.player1).toHavePrompt('Choose a donor character');
                expect(this.player1).not.toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.asakoDiplomat);
                expect(this.player1).not.toBeAbleToSelect(this.asakoTsuki);
                expect(this.player1).toBeAbleToSelect(this.bayushiManipulator);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiShoju);
                expect(this.player1).not.toBeAbleToSelect(this.soshiIllusionist);
            });

            it('should prompt to choose a non-unique character with no fate as the recepient (self)', function() {
                this.player1.clickCard(this.karmicTwist);
                this.player1.clickCard(this.asakoDiplomat);
                expect(this.player1).toHavePrompt('Choose a recipient character');
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).not.toBeAbleToSelect(this.asakoDiplomat);
                expect(this.player1).not.toBeAbleToSelect(this.asakoTsuki);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiManipulator);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiShoju);
                expect(this.player1).not.toBeAbleToSelect(this.soshiIllusionist);
            });

            it('should prompt to choose a non-unique character with no fate as the recepient (opponent)', function() {
                this.player1.clickCard(this.karmicTwist);
                this.player1.clickCard(this.bayushiManipulator);
                expect(this.player1).toHavePrompt('Choose a recipient character');
                expect(this.player1).not.toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).not.toBeAbleToSelect(this.asakoDiplomat);
                expect(this.player1).not.toBeAbleToSelect(this.asakoTsuki);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiManipulator);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiShoju);
                expect(this.player1).toBeAbleToSelect(this.soshiIllusionist);
            });

            it('should move the fate from the donor to the recipient (self)', function() {
                let fate = this.asakoDiplomat.fate;
                this.player1.clickCard(this.karmicTwist);
                this.player1.clickCard(this.asakoDiplomat);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.asakoDiplomat.fate).toBe(0);
                expect(this.adeptOfTheWaves.fate).toBe(fate);
            });

            it('should move the fate from the donor to the recipient (opponent)', function() {
                let fate = this.bayushiManipulator.fate;
                this.player1.clickCard(this.karmicTwist);
                this.player1.clickCard(this.bayushiManipulator);
                this.player1.clickCard(this.soshiIllusionist);
                expect(this.bayushiManipulator.fate).toBe(0);
                expect(this.soshiIllusionist.fate).toBe(fate);
            });
        });
    });
});
