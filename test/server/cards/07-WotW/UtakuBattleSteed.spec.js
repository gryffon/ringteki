describe('Utaku Battle Steed', function() {
    integration(function() {
        describe('Utaku Battle Steed\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune','utaku-yumino','iuchi-shahai'],
                        hand: ['utaku-battle-steed']
                    },
                    player2: {
                        inPlay: ['serene-warrior'],
                        dynastyDiscard: ['favorable-ground'],
                        provinces: ['kuroi-mori'],
                        hand: ['fine-katana']
                    }
                });
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.yumino = this.player1.findCardByName('utaku-yumino');
                this.shahai = this.player1.findCardByName('iuchi-shahai');
                this.battleSteed = this.player1.findCardByName('utaku-battle-steed');
                this.warrior = this.player2.findCardByName('serene-warrior');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori');
                this.katana = this.player2.findCardByName('fine-katana');
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');

                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.yumino],
                    defenders: [],
                    province: this.kuroiMori
                });
            });

            it('should only attach to a unicorn character', function() {
                this.player2.pass();
                this.player1.clickCard(this.battleSteed);
                expect(this.player1).toBeAbleToSelect(this.yumino);
                expect(this.player1).toBeAbleToSelect(this.shahai);
                expect(this.player1).not.toBeAbleToSelect(this.tsukune);
                expect(this.player1).not.toBeAbleToSelect(this.warrior);
                this.player1.clickCard(this.yumino);
                expect(this.yumino.attachments.toArray()).toContain(this.battleSteed);
            });

            it('should give attached character the cavalry trait', function() {
                this.player2.pass();
                this.player1.clickCard(this.battleSteed);
                this.player1.clickCard(this.shahai);
                expect(this.shahai.getTraits()).toContain('cavalry');
            });

            it('should trigger after winning a military conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.battleSteed);
                this.player1.clickCard(this.yumino);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.battleSteed);
            });

            it('should honor attached character after winning a military conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.battleSteed);
                this.player1.clickCard(this.yumino);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.battleSteed);
                expect(this.yumino.isHonored).toBe(true);
            });

            it('should not trigger after winning a political conflict', function() {
                this.player2.clickCard(this.kuroiMori);
                this.player2.clickPrompt('Switch the conflict type');
                this.player1.clickCard(this.battleSteed);
                this.player1.clickCard(this.yumino);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger after losing a military conflict', function() {
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.warrior);
                this.player1.clickCard(this.battleSteed);
                this.player1.clickCard(this.yumino);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.warrior);
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
