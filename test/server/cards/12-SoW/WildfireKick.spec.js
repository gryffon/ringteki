describe('Wildfire Kick', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-mitsu', 'togashi-initiate', 'doji-challenger'],
                    hand: ['a-new-name', 'a-new-name', 'a-new-name', 'wildfire-kick']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'adept-of-shadows']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.wildfire = this.player1.findCardByName('wildfire-kick');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan'); //immune
            this.adept = this.player2.findCardByName('adept-of-shadows'); //not immune
        });

        it('should not allow playing unless you have played 3 cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.adept],
                type: 'military'
            });

            let i = 0;

            for(i = 0; i < 3; i++) {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.wildfire);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.playAttachment(this.player1.filterCardsByName('a-new-name')[i], this.initiate);
            }

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.wildfire);
            expect(this.player1).toHavePrompt('Wildfire Kick');
        });

        it('should allow you to target a participating monk', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.adept],
                type: 'military'
            });

            let i = 0;

            for(i = 0; i < 3; i++) {
                this.player2.pass();
                this.player1.playAttachment(this.player1.filterCardsByName('a-new-name')[i], this.initiate);
            }

            this.player2.pass();
            this.player1.clickCard(this.wildfire);
            expect(this.player1).toHavePrompt('Wildfire Kick');
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
        });

        it('should give appropriate characters -2/-2', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.adept],
                type: 'military'
            });

            let i = 0;

            for(i = 0; i < 3; i++) {
                this.player2.pass();
                this.player1.playAttachment(this.player1.filterCardsByName('a-new-name')[i], this.initiate);
            }

            this.player2.pass();
            this.player1.clickCard(this.wildfire);
            this.player1.clickCard(this.initiate);

            expect(this.kuwanan.getMilitarySkill()).toBe(this.kuwanan.getBaseMilitarySkill());
            expect(this.kuwanan.getPoliticalSkill()).toBe(this.kuwanan.getBasePoliticalSkill());
            expect(this.adept.getMilitarySkill()).toBe(this.adept.getBaseMilitarySkill() - 2);
            expect(this.adept.getPoliticalSkill()).toBe(this.adept.getBasePoliticalSkill() - 2);

            expect(this.initiate.getMilitarySkill()).toBe(this.initiate.getBaseMilitarySkill() + 3); //3x new name
            expect(this.initiate.getPoliticalSkill()).toBe(this.initiate.getBasePoliticalSkill() + 3); //3x new name
            expect(this.challenger.getMilitarySkill()).toBe(this.challenger.getBaseMilitarySkill());
            expect(this.challenger.getPoliticalSkill()).toBe(this.challenger.getBasePoliticalSkill());

            expect(this.getChatLogs(4)).toContain('player1 plays Wildfire Kick to give player2\'s participating characters -2military/-2political if their military skill is equal to or lower than 4. This affects: Adept of Shadows');
        });
    });
});
