describe('Mantra of Earth', function () {
    integration(function () {
        describe('Mantra of Earth\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['kuroi-mori'],
                        inPlay: ['child-of-the-plains', 'togashi-initiate'],
                        hand: ['spreading-the-darkness', 'mantra-of-earth']
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['assassination', 'cloud-the-mind', 'spreading-the-darkness', 'mantra-of-earth']
                    }
                });
                this.mantra = this.player1.findCard('mantra-of-earth', 'hand');
                this.togashi = this.player1.findCard('togashi-initiate');
                this.noMoreActions();
                this.player1.pass();
                this.noMoreActions();
            });

            it('it should trigger when the earth ring is contested', function () {
                this.initiateConflict({
                    ring: 'earth',
                    attackers: ['solemn-scholar']
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantra);
                this.player1.clickCard(this.mantra);
                expect(this.player1).toBeAbleToSelect(this.togashi);
                this.player1.clickCard(this.togashi);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('when the ability is triggered', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        ring: 'earth',
                        province: 'kuroi-mori',
                        attackers: ['solemn-scholar']
                    });
                    this.player1.clickCard(this.mantra);
                    this.player1.clickCard(this.togashi);
                });

                it('should prevent targeting by opponent\'s events', function () {
                    this.player2.clickCard('assassination');
                    expect(this.player2).toHavePrompt('Assassination');
                    expect(this.player2).toBeAbleToSelect('solemn-scholar');
                    expect(this.player2).not.toBeAbleToSelect(this.togashi);
                });

                it('should not prevent attaching attachments to that character', function () {
                    this.player2.clickCard('cloud-the-mind');
                    expect(this.player2).toHavePrompt('Cloud the Mind');
                    expect(this.player2).toBeAbleToSelect('solemn-scholar');
                    expect(this.player2).toBeAbleToSelect(this.togashi);
                });

                it('should not prevent targeting that character with ring effects', function () {
                    this.player1.clickCard('kuroi-mori');
                    this.player1.clickRing('water');
                    this.noMoreActions();
                    expect(this.player2).toHavePrompt('Water Ring');
                    expect(this.player2).toBeAbleToSelect(this.togashi);
                });
            });
        });
    });
});
