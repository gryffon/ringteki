describe('Spoils Of War', function() {
    integration(function() {
        describe('Spoils of War\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['student-of-war'],
                        hand: ['spoils-of-war','spoils-of-war','fine-katana','ornate-fan','strength-in-numbers']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['fine-katana','spoils-of-war'],
                        provinces: ['kuroi-mori']

                    }
                });

                this.studentOfWar = this.player1.findCardByName('student-of-war');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.siN = this.player1.findCardByName('strength-in-numbers');
                this.spoilsOfWar = this.player1.findCardByName('spoils-of-war');

                this.outrider = this.player2.findCardByName('shinjo-outrider');
                this.fineKatanaP2 = this.player2.findCardByName('fine-katana');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori');

                this.player1.moveCard(this.fineKatana, 'conflict deck');
                this.player1.moveCard(this.ornateFan, 'conflict deck');
                this.player1.moveCard(this.siN, 'conflict deck');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.studentOfWar],
                    province: this.kuroiMori,
                    defenders: []
                });
            });

            it('should trigger after you win a military conflict as an attacker', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spoilsOfWar);
            });

            it('should not trigger after winning a political conflict as an attacker', function() {
                this.player2.clickCard(this.kuroiMori);
                this.player2.clickPrompt('Switch the conflict type');
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger after you win a military conflict as a defender', function() {
                this.player2.clickCard(this.outrider);
                this.player1.pass();
                this.player2.clickCard(this.fineKatanaP2);
                this.player2.clickCard(this.outrider);
                this.player1.pass();
                this.player2.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
            });

            it('should draw 3 cards', function() {
                let P1hand = this.player1.hand.length; //5
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.spoilsOfWar);
                this.player1.clickCard(this.spoilsOfWar);
                expect (this.player1.hand.length).toBe(P1hand + 2);
            });

            it('should prompt to discard a card', function() {
                this.noMoreActions();
                this.player1.clickCard(this.spoilsOfWar);
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
                expect(this.player1).toBeAbleToSelect(this.siN);
            });

            it('should discard the chosen card', function() {
                this.noMoreActions();
                this.player1.clickCard(this.spoilsOfWar);
                this.player1.clickCard(this.ornateFan);
                expect(this.ornateFan.location).toBe('conflict discard pile');
            });

            it('should only work once per conflict', function() {
                this.noMoreActions();
                this.player1.clickCard(this.spoilsOfWar);
                this.player1.clickCard(this.ornateFan);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
