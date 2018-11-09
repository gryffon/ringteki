describe('Mantra of Earth', function () {
    integration(function () {
        describe('Mantra of Earth\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player2: {
                        provinces: ['kuroi-mori'],
                        inPlay: ['child-of-the-plains', 'togashi-initiate'],
                        hand: ['spreading-the-darkness', 'mantra-of-earth','tattooed-wanderer']
                    },
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: ['assassination', 'cloud-the-mind', 'spreading-the-darkness', 'mantra-of-earth']
                    }
                });
                this.mantra = this.player2.findCardByName('mantra-of-earth', 'hand');
                this.tatooedWanderer = this.player2.findCardByName('tattooed-wanderer', 'hand');
                this.childOfThePlains = this.player2.findCardByName('child-of-the-plains');
                this.togashi = this.player2.findCardByName('togashi-initiate');
                this.player1.pass();
                this.player2.clickCard(this.tatooedWanderer);
                this.player2.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player2.clickCard(this.childOfThePlains);
                this.noMoreActions();
            });

            it('it should trigger when the earth ring is contested', function () {
                this.initiateConflict({
                    ring: 'earth',
                    attackers: ['solemn-scholar']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.mantra);
                this.player2.clickCard(this.mantra);
                expect(this.player2).toBeAbleToSelect(this.togashi);
                this.player2.clickCard(this.togashi);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should be able to target a character with a monk attachment', function () {
                this.initiateConflict({
                    ring: 'earth',
                    attackers: ['solemn-scholar']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.mantra);
                this.player2.clickCard(this.mantra);
                expect(this.player2).toBeAbleToSelect(this.childOfThePlains);
                this.player2.clickCard(this.childOfThePlains);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('when the ability is triggered', function () {
                beforeEach(function () {
                    this.initHand = this.player2.hand.length;
                    this.initiateConflict({
                        ring: 'earth',
                        province: 'kuroi-mori',
                        attackers: ['solemn-scholar']
                    });
                    this.player2.clickCard(this.mantra);
                    this.player2.clickCard(this.togashi);
                    this.player2.clickPrompt('Done');
                });

                it('should prevent targeting by opponent\'s events', function () {
                    this.player2.pass();
                    this.player1.clickCard('assassination');
                    expect(this.player1).toHavePrompt('Assassination');
                    expect(this.player1).toBeAbleToSelect('solemn-scholar');
                    expect(this.player1).not.toBeAbleToSelect(this.togashi);
                });

                it('should draw 1 card', function () {
                    expect(this.player2.hand.length).toBe(this.initHand);
                });

                it('should not prevent attaching attachments to that character', function () {
                    this.player2.pass();
                    this.player1.clickCard('cloud-the-mind');
                    expect(this.player1).toHavePrompt('Cloud the Mind');
                    expect(this.player1).toBeAbleToSelect('solemn-scholar');
                    expect(this.player1).toBeAbleToSelect(this.togashi);
                });

                it('should not prevent targeting that character with ring effects', function () {
                    this.player2.clickCard('kuroi-mori');
                    this.player2.clickPrompt('Switch the contested ring');
                    this.player2.clickRing('water');
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Water Ring');
                    expect(this.player1).toBeAbleToSelect(this.togashi);
                });
            });
        });
    });
});
