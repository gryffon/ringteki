describe('Shiro Kitsuki', function() {
    integration(function() {
        describe('Shiro Kitsuki\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['fine-katana'],
                        inPlay: ['solemn-scholar'],
                        dynastyDiscard: ['keeper-initiate'],
                        role: 'keeper-of-water',
                        stronghold: 'shiro-kitsuki'
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves', 'fine-katana', 'kami-unleashed'],
                        provinces: ['entrenched-position']
                    }
                });

                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
                this.entrenched = this.player2.findCardByName('entrenched-position');
                this.keeper = this.player1.findCardByName('keeper-initiate');

                this.shiroKitsuki = this.player1.findCardByName('shiro-kitsuki');
                this.scholar = this.player1.findCardByName('solemn-scholar');

                this.noMoreActions();
                this.player1.clickCard(this.scholar);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.entrenched);
                this.player1.clickPrompt('Initiate Conflict');
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

            it('should claim the ring for the player', function() {
                this.player1.clickCard(this.shiroKitsuki);
                this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                this.player2.clickPrompt('Done');
                this.player2.playAttachment(this.fineKatana, this.adept);
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.keeper);
            });
        });
    });
});
