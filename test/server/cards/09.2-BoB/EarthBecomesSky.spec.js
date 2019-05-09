describe('EarthBecomesSky', function() {
    integration(function() {
        describe('EarthBecomesSky\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai','border-rider', 'doji-whisperer'],
                        provinces: ['magistrate-station'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['naive-student'],
                        hand: ['earth-becomes-sky', 'earth-becomes-sky', 'earth-becomes-sky', 'earth-becomes-sky']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.station = this.player1.findCardByName('magistrate-station');

                this.student = this.player2.findCardByName('naive-student');
                this.earthBecomesSky = this.player2.findCardByName('earth-becomes-sky');
            });

            it('should work on regroup phase readying', function() {
                this.dojiWhisperer.fate = 1;
                this.dojiWhisperer.bow();
                this.noMoreActions();
                this.flow.finishConflictPhase();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.dojiWhisperer.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.earthBecomesSky);
                this.player2.clickCard(this.earthBecomesSky);
                expect(this.dojiWhisperer.bowed).toBe(true);
            });

            it('should work after a character readies from its own ability', function() {
                this.borderRider.bowed = true;
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.earthBecomesSky);
                this.player2.clickCard(this.earthBecomesSky);
                expect(this.borderRider.bowed).toBe(true);
            });

            it('should work after the water ring effect readies an opponents character', function() {
                this.dojiWhisperer.bowed = true;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['brash-samurai'],
                    defenders: [],
                    ring: 'water'
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Choose character to bow or unbow');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.earthBecomesSky);
                this.player2.clickCard(this.earthBecomesSky);
                expect(this.dojiWhisperer.bowed).toBe(true);
            });

            it('should work when a character gets readied from external effects', function() {
                this.dojiWhisperer.bow();
                this.dojiWhisperer.honor();

                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();

                this.initiateConflict({
                    attackers: ['naive-student'],
                    defenders: [],
                    ring: 'water',
                    type: 'political',
                    province: this.station
                });

                this.player1.clickCard(this.station);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.earthBecomesSky);
                this.player2.clickCard(this.earthBecomesSky);
                expect(this.dojiWhisperer.bowed).toBe(true);
            });
        });
    });
});
