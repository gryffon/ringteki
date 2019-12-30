describe('Daidoji Uji', function() {
    integration(function() {
        describe('Daidoji Uji\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['daidoji-uji','akodo-toturi-2'],
                        dynastyDiscard: ['doji-whisperer','kakita-kaezin'],
                        hand: ['political-rival','way-of-the-crane','steward-of-law'],
                        fate: 10
                    }
                });

                this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer','province 1');
                this.kakitaKaezin = this.player1.placeCardInProvince('kakita-kaezin','province 2');
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.politicalRival = this.player1.findCardByName('political-rival');
                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.akodoToturi2 = this.player1.findCardByName('akodo-toturi-2');

                this.daidojiUji.honor();
            });

            it('should not let you play characters in hand during the dynasty phase', function() {
                this.player1.clickCard(this.politicalRival);
                expect(this.player1).not.toHavePrompt('Choose additional fate');
            });

            it('should not discount the characters played from province during the dynasty phase', function() {
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('0');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1.fate).toBe(9);
            });

            it('should let you play characters as if they were in your hand', function() {
                this.nextPhase();
                this.nextPhase();
                let fate = this.player1.player.fate;
                expect(this.game.currentPhase).toBe('conflict');
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('0');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1.fate).toBe(fate - 1);
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                this.player1.clickPrompt('1');
                expect(this.kakitaKaezin.location).toBe('play area');
                expect(this.kakitaKaezin.fate).toBe(1);
                expect(this.player1.fate).toBe(fate - 5);
            });

            it('should not discount characters played directly from hand', function() {
                this.nextPhase();
                this.nextPhase();
                let fate = this.player1.player.fate;
                this.player1.clickCard(this.politicalRival);
                this.player1.clickPrompt('0');
                expect(this.politicalRival.location).toBe('play area');
                expect(this.player1.fate).toBe(fate - 3);
                this.player2.pass();
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                expect(this.stewardOfLaw.location).toBe('play area');
                expect(this.player1.fate).toBe(fate - 4);
            });

            it('should not let you play characters as if they were in your hand if Toturi2 is participating', function() {
                this.nextPhase();
                this.nextPhase();
                this.noMoreActions();
                this.player1.player.imperialFavor = 'political';
                expect(this.player1.player.imperialFavor).toBe('political');
                this.initiateConflict({
                    attackers: [this.akodoToturi2],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToturi2);
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.player1).not.toHavePrompt('Choose additional fate');
            });
        });
    });
});
