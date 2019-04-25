describe('Benevolent Host', function() {
    integration(function() {
        describe('Benevolent Host\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['charge'],
                        dynastyDiscard: [
                            'benevolent-host', 'doji-challenger', 'savvy-politician', 'kakita-yoshi'
                        ]
                    },
                    player2: {
                        inPlay: [],
                        dynastyDiscard: [
                            'ikoma-orator'
                        ]
                    }
                });
                this.benevolentHost = this.player1.placeCardInProvince('benevolent-host', 'province 1');
                this.challenger = this.player1.placeCardInProvince('doji-challenger', 'province 2');
                this.savvyPolitician = this.player1.placeCardInProvince('savvy-politician', 'province 3');
                this.kakitaYoshi = this.player1.placeCardInProvince('kakita-yoshi', 'province 4');

                this.orator = this.player2.placeCardInProvince('ikoma-orator', 'province 1');

            });

            it('should trigger after being played', function() {
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.benevolentHost);
            });

            it('should only target Courtier characters in your provinces', function() {
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.benevolentHost);
                expect(this.player1).toHavePrompt('Benevolent Host');
                expect(this.player1).toBeAbleToSelect(this.kakitaYoshi);
                expect(this.player1).toBeAbleToSelect(this.savvyPolitician);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.orator);
                expect(this.player1).not.toBeAbleToSelect('doji-whisperer');
            });

            it('should put the chosen character into play', function() {
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickCard(this.kakitaYoshi);
                expect(this.kakitaYoshi.location).toBe('play area');
            });

            it('should not add 1 fate to the chosen character if its printed cost is greater than 2', function() {
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickCard(this.kakitaYoshi);
                expect(this.kakitaYoshi.location).toBe('play area');
                expect(this.kakitaYoshi.fate).toBe(0);
            });

            it('should add 1 fate to the chosen character if its printed cost is lower or equal to 2', function() {
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.benevolentHost);
                this.player1.clickCard(this.savvyPolitician);
                expect(this.savvyPolitician.location).toBe('play area');
                expect(this.savvyPolitician.fate).toBe(1);
            });

            it('should not trigger after being put into play', function() {
                this.nextPhase();
                this.nextPhase();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doji-whisperer'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.benevolentHost);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
