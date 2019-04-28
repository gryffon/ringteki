describe('Speak to the Heart', function() {
    integration(function() {
        describe('Speak to the Heart\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider','miya-mystic'],
                        hand: ['speak-to-the-heart','speak-to-the-heart']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.speakToTheHeart = this.player1.findCardByName('speak-to-the-heart');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

                let provinces = this.player2.provinces;
                provinces['province 1'].provinceCard.facedown = false;
                provinces['province 2'].provinceCard.facedown = false;
                provinces['province 3'].provinceCard.facedown = false;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiWhisperer]
                });
            });

            it('should give the chosen character +1 political skill for each faceup non-stronghold province your opponent controls', function() {
                this.player2.pass();
                let politicalSkill = this.borderRider.getPoliticalSkill();
                this.player1.clickCard(this.speakToTheHeart);
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.getPoliticalSkill()).toBe(politicalSkill + 3);
            });

            it('should last until the end of the conflict', function() {
                this.player2.pass();
                let politicalSkill = this.borderRider.getPoliticalSkill();
                this.player1.clickCard(this.speakToTheHeart);
                this.player1.clickCard(this.borderRider);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.borderRider.getPoliticalSkill()).toBe(politicalSkill);
            });

            it('shouldn\'t be usable twice in a single conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.speakToTheHeart);
                this.player1.clickCard(this.borderRider);
                this.player2.pass();
                this.speakToTheHeart2 = this.player1.findCardByName('speak-to-the-heart', 'hand');
                this.player1.clickCard(this.speakToTheHeart2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should only target unicorn characters', function() {
                this.player2.pass();
                this.player1.clickCard(this.speakToTheHeart);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
            });
        });
    });
});

