describe('Shiro Kitsuki', function() {
    integration(function() {
        describe('Shiro Kitsuki\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['fine-katana', 'for-shame'],
                        inPlay: ['solemn-scholar', 'asako-tsuki'],
                        dynastyDiscard: ['keeper-initiate'],
                        role: 'keeper-of-water',
                        stronghold: 'shiro-kitsuki'
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves', 'fine-katana', 'kami-unleashed', 'court-games', 'ready-for-battle'],
                        provinces: ['entrenched-position']
                    }
                });

                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.courtGames = this.player2.findCardByName('court-games');
                this.readyForBattle = this.player2.findCardByName('ready-for-battle');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
                this.entrenched = this.player2.findCardByName('entrenched-position');
                this.keeper = this.player1.findCardByName('keeper-initiate');

                this.shiroKitsuki = this.player1.findCardByName('shiro-kitsuki');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.forShame = this.player1.findCardByName('for-shame');
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.scholar, this.asakoTsuki],
                    province: this.entrenched,
                    ring: 'fire',
                    type: 'political'
                });
            });

            it('should trigger at the start of each conflict', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shiroKitsuki);
            });

            it('should prompt the player for a card name when clicked', function() {
                this.player1.clickCard(this.shiroKitsuki);
                expect(this.player1).toHavePrompt('Name a card');
            });

            it('should let the player name a card and claim a ring when the named card is player', function() {
                this.player1.clickCard(this.shiroKitsuki);
                this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                this.player2.clickPrompt('Done');
                this.player2.playAttachment(this.fineKatana, this.adept);
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.player1).toHavePrompt('Choose a ring to claim');
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.isUnclaimed()).toBe(false);
            });


            it('should work with cards other than the first card played in a conflict (ready for battle as a reaction)', function() {
                this.player1.clickCard(this.shiroKitsuki);
                this.player1.chooseCardInPrompt(this.readyForBattle.name, 'card-name');
                this.player2.clickCard(this.adept);
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('Pass');

                this.player1.clickCard(this.forShame);
                this.player1.clickCard(this.adept);
                this.player2.clickPrompt('bow this character');
                this.player2.clickCard(this.readyForBattle);

                expect(this.adept.bowed).toBe(false);
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.player1).toHavePrompt('Choose a ring to claim');
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.isUnclaimed()).toBe(false);
            });

            it('should claim the ring for the player', function() {
                this.player1.clickCard(this.shiroKitsuki);
                this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                this.player2.clickPrompt('Done');
                this.player2.playAttachment(this.fineKatana, this.adept);
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.keeper);
            });

            it('should change the ring to political', function() {
                this.player1.clickCard(this.shiroKitsuki);
                this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                this.player2.clickPrompt('Done');
                this.player2.playAttachment(this.fineKatana, this.adept);
                this.game.rings.earth.conflictType = 'military';
                expect(this.game.rings.earth.conflictType).toBe('military');
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.conflictType).toBe('political');
            });
        });
    });
});
