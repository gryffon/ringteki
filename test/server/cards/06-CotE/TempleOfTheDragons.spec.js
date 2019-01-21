describe('Temple of the Dragons', function() {
    integration(function() {
        describe('During a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['temple-of-the-dragons']
                    }
                });
                this.zerker = this.player1.findCardByName('matsu-berserker');
                this.totd = this.player2.findCardByName('temple-of-the-dragons');

                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: [this.zerker]
                });
            });

            it('should trigger after being revealed', function () {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.totd);
            });

            it('should correctly prompt the contested', function () {
                this.player2.clickCard(this.totd);
                expect(this.player2).toHavePrompt('Fire Ring');
            });

            it('should allow the defender to trigger the contested ring', function () {
                this.player2.clickCard(this.totd);
                this.player2.clickCard(this.zerker);
                this.player2.clickPrompt('Dishonor Matsu Berserker');
                expect(this.zerker.isDishonored).toBe(true);
            });
        });

        describe('During a conflict with no eligible targets for the contested ring', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['temple-of-the-dragons']
                    }
                });
                this.zerker = this.player1.findCardByName('matsu-berserker');

                this.totd = this.player2.findCardByName('temple-of-the-dragons');

                this.noMoreActions();
                this.initiateConflict({
                    ring: 'void',
                    attackers: [this.zerker]
                });
            });

            it('should trigger ?', function () {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.totd);
            });
        });

        describe('With Isawa Kaede and Seeker of Knowledge', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        dynastyDiscard:['isawa-kaede'],
                        hand: ['seeker-of-knowledge']
                    },
                    player2: {
                        provinces: ['temple-of-the-dragons']
                    }
                });
                this.zerker = this.player1.findCardByName('matsu-berserker');
                this.kaede = this.player1.findCardByName('isawa-kaede');
                this.seeker = this.player1.findCardByName('seeker-of-knowledge');

                this.totd = this.player2.findCardByName('temple-of-the-dragons');
            });

            it('should be able to resolve multiple elements', function () {
                this.player1.clickCard(this.seeker);
                this.player1.clickPrompt('0');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: [this.seeker]
                });
                expect(this.player2).toBeAbleToSelect(this.totd);
                this.player2.clickCard(this.totd);
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                expect(this.player2).toBeAbleToSelectRing('fire');
                expect(this.player2).toBeAbleToSelectRing('air');
                this.player2.clickRing('air');
                expect(this.player2).toHavePrompt('Air Ring');
            });

            it('should not allow the defender to resolve all elements if Kaede is attacking', function () {
                this.player1.putIntoPlay(this.kaede);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: [this.kaede]
                });
                expect(this.player2).toBeAbleToSelect(this.totd);
                this.player2.clickCard(this.totd);
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                expect(this.player2).toBeAbleToSelectRing('void');
                expect(this.player2).toBeAbleToSelectRing('fire');
                expect(this.player2).not.toHavePrompt('Resolve All Elements');
            });
        });
    });
});

