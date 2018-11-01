describe('Iron Mine', function() {
    integration(function() {
        describe('Iron Mine\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'borderlands-defender'],
                        dynastyDiscard: ['iron-mine'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro'],
                        hand: ['fiery-madness']
                    }
                });
                this.ironMine = this.player1.placeCardInProvince('iron-mine', 'province 1');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.assassination = this.player1.findCardByName('assassination');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.borderlandsDefender],
                    defenders: [this.bayushiAramoro]
                });
            });

            it('should be able to be used when a character you control is leaving play', function () {
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.hidaGuardian);
                expect(this.player1).toBeAbleToSelect(this.ironMine);
            });

            describe('if it resolves', function () {
                beforeEach(function () {
                    this.player2.pass();
                    this.player1.clickCard(this.assassination);
                    this.player1.clickCard(this.hidaGuardian);
                    this.player1.clickCard(this.ironMine);
                });

                it('should prevent the character from leaving play', function () {
                    expect(this.hidaGuardian.location).toBe('play area');
                });

                it('should sacrifice itself', function () {
                    expect(this.ironMine.location).toBe('dynasty discard pile');
                });

                it('should refill the province', function () {
                    this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                    expect(this.newCard).not.toBeUndefined();
                });

            });

            describe('if the character still leaves play (due to a lasting effect)', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.bayushiAramoro);
                    this.player2.clickCard(this.hidaGuardian);
                    this.player1.clickCard(this.ironMine);
                });

                it('should refill the province', function () {
                    this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                    expect(this.newCard).not.toBeUndefined();
                });
            });

            describe('if the character still leaves play later in the turn (due to a lasting effect)', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.bayushiAramoro);
                    this.player2.clickCard(this.borderlandsDefender);
                    this.player1.pass();
                    this.fieryMadness = this.player2.playAttachment('fiery-madness', this.borderlandsDefender);
                });

                it('should refill the province', function () {
                    expect(this.fieryMadness.location).toBe('play area');
                    expect(this.borderlandsDefender.militarySkill).toBe(0);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.ironMine);
                    this.player1.clickCard(this.ironMine);
                    expect(this.ironMine.location).toBe('dynasty discard pile');
                    expect(this.borderlandsDefender.location).toBe('dynasty discard pile');
                    this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                    expect(this.newCard).not.toBeUndefined();
                });
            });

        });
    });
});
