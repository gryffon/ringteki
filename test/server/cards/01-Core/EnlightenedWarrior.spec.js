describe('Enlightened Warrior', function() {
    integration(function() {
        describe('Enlightened Warrior\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['know-the-world']
                    },
                    player2: {
                        inPlay: ['enlightened-warrior'],
                        hand: ['the-stone-of-sorrows']
                    }
                });

                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.enlightenedWarrior = this.player2.findCardByName('enlightened-warrior');
                this.knowTheWorld = this.player1.findCardByName('know-the-world');

                this.player1.claimRing('void');
                this.game.rings.water.fate = 1;
            });

            it('should trigger when your opponent selects a ring with fate on it (during conflict declaration)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'water'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.enlightenedWarrior);
            });

            it('should not trigger when your opponent selects a ring with no fate on it (during conflict declaration)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'fire'
                });
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should place 1 fate on Enlightened Warrior', function() {
                let fate = this.enlightenedWarrior.fate;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'water'
                });
                this.player2.clickCard(this.enlightenedWarrior);
                expect(this.enlightenedWarrior.fate).toBe(fate + 1);
            });

            it('should not trigger when you select a ring with fate on it (during conflict declaration)', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.enlightenedWarrior],
                    ring: 'water'
                });
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Choose defenders');
            });

            it('should not trigger when you gain fate outside of conflict declaration', function() {
                let fate = this.player1.fate;
                this.player1.clickCard(this.knowTheWorld);
                this.player1.clickRing('void');
                this.player1.clickRing('water');
                expect(this.game.rings.water.claimedBy).toBe(this.player1.player.name);
                expect(this.player1.fate).toBe(fate); //-1 for event, +1 from ring
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should trigger when your opponent selects a ring with fate on it even if they can\'t get the fate (during conflict declaration)', function() {
                let fate = this.player1.fate;
                this.player1.pass();
                this.player2.playAttachment('the-stone-of-sorrows', this.enlightenedWarrior);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'water'
                });
                expect(this.player1.fate).toBe(fate);
                expect(this.game.rings.water.fate).toBe(1);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.enlightenedWarrior);
            });
        });
    });
});
