describe('Isawa Heiko', function () {
    integration(function () {
        describe('Isawa Heiko\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-heiko', 'isawa-kaede'],
                        hand: ['supernatural-storm', 'against-the-waves']
                    },
                    player2: {
                        inPlay: ['goblin-sneak', 'akodo-makoto', 'solemn-scholar'],
                        hand: ['clarity-of-purpose']
                    }
                });

                this.heiko = this.player1.findCardByName('isawa-heiko');
                this.kaede = this.player1.findCardByName('isawa-kaede');
                this.against = this.player1.findCardByName('against-the-waves');
                this.storm = this.player1.findCardByName('supernatural-storm');

                this.clarity = this.player2.findCardByName('clarity-of-purpose');
                this.solemn = this.player2.findCardByName('solemn-scholar');
                this.goblin = this.player2.findCardByName('goblin-sneak');
                this.makoto = this.player2.findCardByName('akodo-makoto');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.heiko, this.kaede],
                    defenders: [this.makoto, this.goblin]
                });
            });

            it('should trigger when you play a water card', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heiko);
            });

            it('should be able to target your own characters in the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                expect(this.player1).toBeAbleToSelect(this.heiko);
                expect(this.player1).toBeAbleToSelect(this.kaede);
            });

            it('should be able to select opponents characters that are partipating', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                expect(this.player1).toBeAbleToSelect(this.makoto);
            });

            it('should not be able to select dash characters', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                expect(this.player1).not.toBeAbleToSelect(this.goblin);
            });

            it('should swap the stats for the character', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.makoto);
                expect(this.makoto.getMilitarySkill()).toBe(1);
                expect(this.makoto.getPoliticalSkill()).toBe(4);
            });

            it('should target characters at home', function() {
                this.player2.pass();
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                expect(this.player1).toBeAbleToSelect(this.solemn);
            });

            it('should not trigger when the opponent plays a water card', function() {
                this.player2.clickCard(this.clarity);
                this.player2.clickCard(this.makoto);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to trigger outside of a conflict', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.against);
                this.player1.clickCard(this.heiko);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.heiko);
                this.player1.clickCard(this.heiko);
                expect(this.heiko.getMilitarySkill()).toBe(5);
            });
        });
    });
});
