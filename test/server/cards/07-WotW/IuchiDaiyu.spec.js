describe('Iuchi Daiyu', function() {
    integration(function() {
        describe('Iuchi Daiyu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['iuchi-daiyu', 'border-rider']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.iuchiDaiyu = this.player1.findCardByName('iuchi-daiyu');
                this.borderRider = this.player1.findCardByName('border-rider');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

                let provinces = this.player2.provinces;
                provinces['province 1'].provinceCard.facedown = false;
                provinces['province 2'].provinceCard.facedown = false;
                provinces['province 3'].provinceCard.facedown = false;
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.iuchiDaiyu);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.borderRider],
                        defenders: [this.dojiWhisperer]
                    });
                });

                it('should prompt you to choose a character', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.iuchiDaiyu);
                    expect(this.player1).toHavePrompt('Iuchi Daiyu');
                    expect(this.player1).toBeAbleToSelect(this.iuchiDaiyu);
                    expect(this.player1).toBeAbleToSelect(this.borderRider);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                });

                it('should give the chosen character +1 military skill for each faceup non-stronghold province your opponent controls', function() {
                    this.player2.pass();
                    let militarySkill = this.borderRider.getMilitarySkill();
                    this.player1.clickCard(this.iuchiDaiyu);
                    this.player1.clickCard(this.borderRider);
                    expect(this.borderRider.getMilitarySkill()).toBe(militarySkill + 3);
                });

                it('should last until the end of the conflict', function() {
                    this.player2.pass();
                    let militarySkill = this.borderRider.getMilitarySkill();
                    this.player1.clickCard(this.iuchiDaiyu);
                    this.player1.clickCard(this.borderRider);
                    this.player2.pass();
                    this.player1.pass();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.borderRider.getMilitarySkill()).toBe(militarySkill);
                });
            });
        });
    });
});

