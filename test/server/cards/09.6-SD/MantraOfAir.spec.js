describe('Mantra of Earth', function () {
    integration(function () {
        describe('Mantra of Earth\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar', 'seeker-of-knowledge']
                    },
                    player2: {
                        inPlay: ['child-of-the-plains', 'togashi-initiate', 'togashi-mitsu'],
                        hand: ['mantra-of-air', 'tattooed-wanderer']
                    }
                });
                this.mantra = this.player2.findCardByName('mantra-of-air');
                this.tatooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.childOfThePlains = this.player2.findCardByName('child-of-the-plains');
                this.togashi = this.player2.findCardByName('togashi-initiate');
                this.mitsu = this.player2.findCardByName('togashi-mitsu');
                this.mitsu.honor();

                this.player1.pass();
                this.player2.clickCard(this.tatooedWanderer);
                this.player2.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player2.clickCard(this.childOfThePlains);
                this.noMoreActions();
            });

            it('it should trigger when the air ring is contested', function () {
                this.initiateConflict({
                    ring: 'air',
                    attackers: ['solemn-scholar']
                });
                let hand = this.player2.hand.length;
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.mantra);
                this.player2.clickCard(this.mantra);
                expect(this.player2).toBeAbleToSelect(this.togashi);
                expect(this.player2).toBeAbleToSelect(this.childOfThePlains);
                expect(this.player2).not.toBeAbleToSelect(this.mitsu);
                this.player2.clickCard(this.togashi);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.togashi.isHonored).toBe(true);
                expect(this.player2.hand.length).toBe(hand); //-1 from mantra, +1 from drawing
            });

            it('it should not trigger when another ring is contested', function () {
                this.initiateConflict({
                    ring: 'earth',
                    attackers: ['solemn-scholar']
                });
                expect(this.player2).toHavePrompt('Choose Defenders');
            });

            it('it should trigger when air is given to the contested ring', function () {
                this.initiateConflict({
                    ring: 'earth',
                    attackers: ['seeker-of-knowledge']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.mantra);
            });
        });
    });
});
