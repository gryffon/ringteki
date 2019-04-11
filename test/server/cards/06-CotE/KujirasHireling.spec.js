describe('Kujira\'s Hireling', function() {
    integration(function() {
        describe('Kujira\'s Hireling\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kujira-s-hireling']
                    },
                    player2: {
                    }
                });
                this.kujirasHireling = this.player1.findCardByName('kujira-s-hireling');
            });

            it('should be able to be triggered by its controller and cost 1 fate', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.kujirasHireling);
                expect(this.player1).toHavePrompt('Kujira\'s Hireling');
            });

            it('should be able to be triggered by its controller\'s opponent and cost 1 fate', function() {
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.kujirasHireling);
                expect(this.player2).toHavePrompt('Kujira\'s Hireling');
            });

            it('should prompt to choose if you wish to +1/+1 or -1/-1', function() {
                this.player1.clickCard(this.kujirasHireling);
                expect(this.player1).toHavePrompt('Kujira\'s Hireling');
                expect(this.player1).toHavePromptButton('+1/+1');
                expect(this.player1).toHavePromptButton('-1/-1');
            });

            it('should cost 1 fate', function() {
                this.player1.pass();
                let player2fate = this.player2.player.fate;
                this.player2.clickCard(this.kujirasHireling);
                this.player2.clickPrompt('+1/+1');
                expect(this.player2.player.fate).toBe(player2fate - 1);
            });

            it('should give +1/+1 if chosen', function() {
                expect(this.kujirasHireling.getMilitarySkill()).toBe(1);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(1);
                this.player1.clickCard(this.kujirasHireling);
                this.player1.clickPrompt('+1/+1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(2);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(2);
            });

            it('should give -1/-1 if chosen', function() {
                expect(this.kujirasHireling.getMilitarySkill()).toBe(1);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(1);
                this.player1.clickCard(this.kujirasHireling);
                this.player1.clickPrompt('-1/-1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(0);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(0);
            });

            it('should be able to be triggered multiple times', function() {
                expect(this.kujirasHireling.getMilitarySkill()).toBe(1);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(1);
                this.player1.clickCard(this.kujirasHireling);
                this.player1.clickPrompt('+1/+1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(2);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(2);
                this.player2.clickCard(this.kujirasHireling);
                this.player2.clickPrompt('-1/-1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(1);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(1);
                this.player1.clickCard(this.kujirasHireling);
                this.player1.clickPrompt('+1/+1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(2);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(2);
                this.player2.pass();
                this.player1.clickCard(this.kujirasHireling);
                this.player1.clickPrompt('+1/+1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(3);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(3);
                this.player2.clickCard(this.kujirasHireling);
                this.player2.clickPrompt('-1/-1');
                expect(this.kujirasHireling.getMilitarySkill()).toBe(2);
                expect(this.kujirasHireling.getPoliticalSkill()).toBe(2);
            });
        });
    });
});
