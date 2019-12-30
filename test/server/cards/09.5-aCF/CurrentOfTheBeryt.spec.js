describe('Current of the Beryt', function() {
    integration(function() {
        describe('Current of the Beryt', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tattooed-wanderer', 'agasha-swordsmith' , 'ancient-master'],
                        hand: ['current-of-the-beryt', 'fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['seppun-guardsman', 'adept-of-the-waves']
                    }
                });
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.currentOfTheBeryt = this.player1.findCardByName('current-of-the-beryt');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['ancient-master','agasha-swordsmith'],
                    defenders: ['seppun-guardsman']
                });
                this.player2.pass();
            });

            it('should only attach to a shugenja', function() {
                this.player1.clickCard(this.currentOfTheBeryt);
                expect(this.player1).toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).not.toBeAbleToSelect(this.tattooedWanderer);
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.agashaSwordsmith.attachments).toContain(this.currentOfTheBeryt);
                expect(this.currentOfTheBeryt.location).toBe('play area');
            });

            it('should permit two consecutive actions when activated', function() {
                this.player1.clickCard(this.currentOfTheBeryt);
                expect(this.player1).toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).not.toBeAbleToSelect(this.tattooedWanderer);
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.agashaSwordsmith.attachments).toContain(this.currentOfTheBeryt);
                expect(this.currentOfTheBeryt.location).toBe('play area');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.clickCard(this.currentOfTheBeryt);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.playAttachment('fine-katana', 'ancient-master');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.playAttachment('ornate-fan', 'tattooed-wanderer');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });
    });
});
